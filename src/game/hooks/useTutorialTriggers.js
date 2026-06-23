import { useEffect } from 'react';
import { AutomineConfig } from '../config/AutomineConfig.js';

export const useTutorialTriggers = ({
    tutorialStep,
    setTutorialStep,
    gameState,
    setGameState,
    setOpenModal,
    setRentalModalOpen,
    handleUnlockTutorialFeature,
}) => {
    // Intro: bienvenida si es la primera vez
    useEffect(() => {
        if (!gameState.tutorial?.completed && !gameState.tutorial?.introDone) {
            setTimeout(() => setTutorialStep('intro'), 400);
        }
    }, [gameState.tutorial?.completed, gameState.tutorial?.introDone]); // eslint-disable-line

    // Paso 0: apunta a oro/segundo tras ver intro
    useEffect(() => {
        if (gameState.tutorial?.completed) return;
        if (!gameState.tutorial?.introDone) return;
        if (gameState.tutorial?.currentStep === 0) {
            setTimeout(() => setTutorialStep(0), 500);
        }
    }, [gameState.tutorial?.currentStep, gameState.tutorial?.completed, gameState.tutorial?.introDone]); // eslint-disable-line

    // Pasos de hint (taberna→mina→forja): tras completar el pico
    useEffect(() => {
        if (gameState.tutorial?.currentStep === 3 && !gameState.tutorial?.minesHinted) {
            setOpenModal(null);
            setTutorialStep('hint_tavern');
        }
    }, [gameState.tutorial?.currentStep, gameState.tutorial?.minesHinted]); // eslint-disable-line

    // Paso 1: tras comprar oro/segundo, snacks primero y luego stamina
    useEffect(() => {
        if (
            gameState.tutorial?.goldPerSecondBought &&
            gameState.tutorial?.currentStep === 1 &&
            !gameState.tutorial?.staminaUnlocked
        ) {
            if (!gameState.tutorial?.snacksHinted) {
                setTutorialStep('0_snacks');
            } else {
                setTutorialStep(1);
                handleUnlockTutorialFeature('stamina');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        gameState.tutorial?.goldPerSecondBought,
        gameState.tutorial?.currentStep,
        gameState.tutorial?.staminaUnlocked,
        gameState.tutorial?.snacksHinted,
    ]);

    // Paso 2: desbloquea pico tras mejorar stamina
    useEffect(() => {
        if (
            gameState.tutorial?.staminaUpgradeDone &&
            gameState.tutorial?.currentStep === 2 &&
            !gameState.tutorial?.pickaxeUnlocked
        ) {
            setTutorialStep(2);
            handleUnlockTutorialFeature('pickaxe');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        gameState.tutorial?.staminaUpgradeDone,
        gameState.tutorial?.currentStep,
        gameState.tutorial?.pickaxeUnlocked,
    ]);

    // stamina_hint: burst activado → mine_tap
    useEffect(() => {
        if (tutorialStep === 'stamina_hint' && gameState.burst?.active) {
            setTutorialStep('mine_tap');
        }
    }, [gameState.burst?.active, tutorialStep]); // eslint-disable-line

    // mine_tap: pico roto → repair_hint
    useEffect(() => {
        if (tutorialStep === 'mine_tap' && gameState.pickaxe.durability === 0) {
            setTutorialStep('repair_hint');
        }
    }, [gameState.pickaxe.durability, tutorialStep]); // eslint-disable-line

    // repair_hint: reparado → automine_hint
    useEffect(() => {
        if (tutorialStep === 'repair_hint' && gameState.pickaxe.durability > 0) {
            setTutorialStep('automine_hint');
        }
    }, [gameState.pickaxe.durability, tutorialStep]); // eslint-disable-line

    // hint_rental: inyecta Zeus cuando empieza el paso
    useEffect(() => {
        if (tutorialStep !== 'hint_rental') return;
        if ((gameState.tutorial?.rentalTutorialStep ?? 0) !== 0) return;
        setGameState(prev => ({
            ...prev,
            rental: { ...prev.rental, available: { dogId: 'zeus', rarity: 'rare', cost: 0 } },
        }));
    }, [tutorialStep]); // eslint-disable-line

    // hint_rental: Zeus alquilado → inyectar Druh
    useEffect(() => {
        if (tutorialStep !== 'hint_rental') return;
        if ((gameState.tutorial?.rentalTutorialStep ?? 0) !== 0) return;
        const zeusRented = (gameState.rental?.active ?? []).some(r => r.dogId === 'zeus');
        if (zeusRented && !gameState.rental?.available) {
            setGameState(prev => ({
                ...prev,
                tutorial: { ...prev.tutorial, rentalTutorialStep: 1 },
                rental: { ...prev.rental, available: { dogId: 'druh', rarity: 'rare', cost: 0 } },
            }));
        }
    }, [gameState.rental?.active, gameState.rental?.available, tutorialStep, gameState.tutorial?.rentalTutorialStep]); // eslint-disable-line

    // hint_rental: Druh alquilado → avanzar a raids
    useEffect(() => {
        if (tutorialStep !== 'hint_rental') return;
        if ((gameState.tutorial?.rentalTutorialStep ?? 0) !== 1) return;
        const druhRented = (gameState.rental?.active ?? []).some(r => r.dogId === 'druh');
        if (druhRented) {
            setGameState(prev => ({
                ...prev,
                tutorial: { ...prev.tutorial, rentalTutorialStep: 2 },
            }));
            setRentalModalOpen(false);
            setTutorialStep('hint_raids');
        }
    }, [gameState.rental?.active, tutorialStep, gameState.tutorial?.rentalTutorialStep]); // eslint-disable-line

    // Tutorial modal auto-open: recovery tras recarga en fase '0_snacks'
    useEffect(() => {
        if (tutorialStep === '0_snacks') {
            setOpenModal('goldPerSecond');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tutorialStep]);

    // Hint automine: primera vez que el jugador alcanza el coste de desbloqueo
    useEffect(() => {
        if (
            !gameState.automine?.unlocked &&
            !gameState.tutorial?.automineHinted &&
            gameState.gold >= AutomineConfig.unlockCost
        ) {
            setGameState(prev => ({ ...prev, tutorial: { ...prev.tutorial, automineHinted: true } }));
        }
    }, [gameState.gold]); // eslint-disable-line
};
