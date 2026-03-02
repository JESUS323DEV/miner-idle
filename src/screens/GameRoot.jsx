import { useState, useEffect } from "react";

// ===== HOOKS =====
import useGoldPerSecond from "../game/hooks/useGoldPerSecond.js";
import { useGameActions } from "../game/hooks/useGameActions.js";
import { useAutoMining } from "../game/hooks/useAutoMining.js";

import useSnackBuffs from "../game/hooks/useSnackBuffs.js";
import useAutomine from "../game/hooks/useAutomine.js";
import useAutomineCooldown from "../game/hooks/useAutomineCooldown.js";

import { AutomineConfig } from "../game/AutomineConfig.js";

// ===== ESTADOS INICIALES =====
import InitialGameState from "../game/initialState/InitialGameState.js";
import InitialPickaxeState from "../game/initialState/InitialPickaxeState.js";
import InitialLadyState from "../game/initialState/lady/InitialLadyState.js";

// ===== COMPONENTES =====
//modals-screens-
import UpgradeModal from "../components/modals/UpgradeModal.jsx";
import ModalsMenu from "../components/modals/ModalsMenu.jsx";
import TavernModal from "./modalTavern/TavernModal.jsx";

import GoldMine from "../components/GoldMine.jsx";
import TutorialPointer from "../components/TutorialPointer.jsx";
import ForgeModal from '../screens/modalForge/ForgeModal';

// ===== ASSETS: UI =====
import cofre from "../assets/ui/icons-hud/hud-principal/cofre-oro2.png";

// ===== ASSETS: FONDOS =====
import bgMain from "../assets/backgrounds/fondo2.png";

// ===== ASSETS: ORES =====
import bronze1 from "../assets/ui/icons-hud/hud-ores/bronze1.png"
import metal1 from "../assets/ui/icons-hud/hud-ores/metal1.png"
import diamond1 from "../assets/ui/icons-hud/hud-ores/diamante1.png"

// ===== ASSETS: HUD =====
import gold from "../assets/ui/icons-hud/hud-principal/oro2.png";
import coinTavern from "../assets/ui/icons-hud/hud-principal/coin-tavern.png"
import stamina from "../assets/ui/icons-hud/hud-principal/rayo.png";
import pickAxe from "../assets/ui/pico1.png";

// ===== ASSETS: HUD AUTO MINE =====
import activeMine from "../assets/ui/icons-auto-mine/active-mine.png"
import stopMine from "../assets/ui/icons-auto-mine/stop-mine.png"


// ===== ASSETS: PICOS =====
import pickStone from "../assets/ui/pico1.png";
import pickAxeBronze from "../assets/ui/icons-pickaxe/pico-bronze.png";
import pickAxeHierro from "../assets/ui/icons-pickaxe/pico-hierro.png";

// ===== ASSETS: MODAL MINAS =====
import mineModal from "../assets/ui/icon-mine.png"

// ===== ASSETS: MODAL TAVERN =====
import iconTavern from "../assets/ui/icon-tavern.png"
// ===== ASSETS:fORGE =====
import iconForge from "../assets/ui/icon-forge.png"




// ===== MINAS =====
import MinesConfig from "../game/MinesConfig.js";
import InitialMinesState from "../game/initialState/InitialMinesState.js";
import MinesMapModal from "../screens/modalMine/MinesMapModal.jsx";
import MineScreen from "../screens/modalMine/MineScreen.jsx";

// ===== ASSETS: MODALES =====
import bgGold from "../assets/backgrounds/bg-modals-hud/fondoGold.png";
import iconGold from "../assets/ui/icons-hud/hud-modals/goldXsecond.png";
import buttonUpgrade from "../assets/ui/icons-hud/hud-modals/buttonUpgrade.png";
import bgStamina from "../assets/backgrounds/bg-modals-hud/bgStamina.png";
import upgradeStamina from "../assets/ui/icons-hud/hud-modals/upgradeStamina.png";
import refillStamina from "../assets/ui/icons-hud/hud-modals/refillStamina.png";
import bgPickaxe from "../assets/backgrounds/bg-modals-hud/fondoWorkShop.png";
import repairPickaxe from "../assets/ui/icons-hud/hud-modals/repairPickaxe.png";
import PickAxeUp from "../assets/ui/icons-hud/hud-modals/btn-pickAxeUp.png";
import btnTier from "../assets/ui/icons-hud/hud-modals/btnTier.png";

// ===== CSS =====
import "../styles/gameRoot.css";

// ===== ICONS =====
import { Menu, Settings } from "lucide-react";

function GameRoot() {
    // ===== ESTADOS =====
    const [isResetting, setIsResetting] = useState(false);
    const [isMineScreenOpen, setIsMineScreenOpen] = useState(false);
    const [openModal, setOpenModal] = useState(null);
    const [menuOpenModal, setMenuOpenModal] = useState(false);
    const [minesModalOpen, setMinesModalOpen] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(null);
    const [goldFloatingNumbers, setGoldFloatingNumbers] = useState([]);
    const [tavernModalOpen, setTavernModalOpen] = useState(false);
    const [oreFloatingNumbers, setOreFloatingNumbers] = useState([]);
    const [forgeModalOpen, setForgeModalOpen] = useState(false)

    // ===== GAME STATE =====
    const [gameState, setGameState] = useState(() => {
        const saved = localStorage.getItem('ladyHungryGame');
        if (saved) return JSON.parse(saved);
        return {
            ...InitialGameState,
            lady: InitialLadyState,
            pickaxe: InitialPickaxeState,
            mines: InitialMinesState,
        };
    });

    // ===== AUTO-SAVE =====
    useEffect(() => {
        if (!isResetting) {
            localStorage.setItem('ladyHungryGame', JSON.stringify(gameState));
        }
    }, [gameState, isResetting]);

    // ===== NEW GAME =====
    const handleNewGame = () => {
        if (window.confirm('¿Seguro que quieres empezar un nuevo juego? Se perderá todo el progreso.')) {
            setIsResetting(true);
            localStorage.removeItem('ladyHungryGame');
            setTimeout(() => location.reload(), 0);
        }
    };

    // ===== ACTIONS =====
    const {
        handleFeedLady,
        handleBuyGoldPerSecondUpgrade,
        handleBuyMaxStaminaUpgrade,
        handleRefillStamina,
        handleUpgradePickaxeMaterial,
        handleUpgradePickaxeTier,
        handleRepairPickaxe,
        handleMine,
        handleMineClick,

        handleUnlockMineType,
        handleEnterMine,
        handleDiscardMine,
        handleMineVein,
        handleExitMine,
        handleTutorialStep,
        handleUnlockTutorialFeature,
        handleCompleteTutorial,
        handleUnlockSnack,
        handleUpgradeSnack,
        handleUseSnack,
        handleConvertMaterial,
        handleUnlockAutomine,
        handleActivateAutomine,
        handleStopAutomine,
        handleUnlockTavern,
        handleUnlockMinesMap,
        handleConvertCoinsToGold,
        handleUnlockFurnace,
        handleStartSmelt,
        handleCollectIngot,
        handleUpgradeFurnace,



    } = useGameActions(setGameState);

    // ===== PICKAXE LOGIC =====
    const isTierUpgrade = gameState.pickaxe.tier < 3;
    const pickaxeUpgradeCost = isTierUpgrade ? gameState.pickaxe.tierUpgradeCost : gameState.pickaxe.materialUpgradeCost;
    const canUpgradePickaxe = gameState.gold >= pickaxeUpgradeCost;
    const handlePickaxeUpgrade = isTierUpgrade ? handleUpgradePickaxeTier : handleUpgradePickaxeMaterial;
    const canRepairPickaxe = gameState.pickaxe.durability < gameState.pickaxe.maxDurability && gameState.gold >= gameState.pickaxe.repairCost;

    const getMaterialRequired = () => {
        if (gameState.pickaxe.material === "stone") return { type: "bronzeIngot", amount: 5 };
        if (gameState.pickaxe.material === "bronze") return { type: "ironIngot", amount: 3 };
        if (gameState.pickaxe.material === "metal") return { type: "diamondIngot", amount: 2 };
        return null;
    };

    const materialReq = getMaterialRequired();
    const canAffordMaterialUpgrade = gameState.pickaxe.tier === 3 && gameState.gold >= gameState.pickaxe.materialUpgradeCost && materialReq && gameState[materialReq.type] >= materialReq.amount;

    const getPickaxeIcon = (material) => {
        const icons = { stone: pickStone, bronze: pickAxeBronze, metal: pickAxeHierro };
        return icons[material] || pickStone;
    };

    // ===== HOOKS =====
    useGoldPerSecond(gameState, setGameState);
    useAutoMining(gameState, handleMine, setGameState);
    useSnackBuffs(gameState, setGameState);
    useAutomine(gameState, handleMineClick, handleStopAutomine);
    useAutomineCooldown(gameState, setGameState);

    // ✅ Calcula cooldown de automine

    const availableCharges = gameState.automine?.charges?.filter(c => c.available).length || 0;

    const showOreCost = (type, amount) => {
        const id = Date.now();
        setOreFloatingNumbers(prev => [...prev, { id, type, value: amount }]);
        setTimeout(() => {
            setOreFloatingNumbers(prev => prev.filter(n => n.id !== id));
        }, 1500);
    };

    useEffect(() => {
        console.log('lastMineReward:', gameState.lastMineReward);
        if (gameState.lastMineReward) {
            showOreCost(gameState.lastMineReward.type, gameState.lastMineReward.amount);
        }
    }, [gameState.lastMineReward]);

    const getChargeTimers = () => {
        if (!gameState.automine?.charges) return [];
        const now = Date.now();
        return gameState.automine.charges.map(charge => {
            if (charge.available) return null;
            if (!charge.cooldownUntil) return null;
            const remaining = Math.max(0, Math.ceil((charge.cooldownUntil - now) / 1000));
            return remaining;
        });
    };

    const chargeTimers = getChargeTimers();

    // ===== TUTORIAL TRIGGERS =====
    // Trigger paso 0: Oro/segundo (solo muestra animación)
    useEffect(() => {
        if (gameState.tutorial?.currentStep === 0 && !gameState.tutorial?.completed) {
            setTimeout(() => setTutorialStep(0), 500);
        }
    }, [gameState.tutorial?.currentStep]);

    // Trigger paso 1: Stamina
    useEffect(() => {
        if (gameState.tutorial?.goldPerSecondBought &&
            gameState.tutorial?.currentStep === 1 &&
            !gameState.tutorial?.staminaUnlocked) {

            setTutorialStep(1);
            handleUnlockTutorialFeature('stamina');
        }
    }, [gameState.tutorial?.goldPerSecondBought, gameState.tutorial?.currentStep, gameState.tutorial?.staminaUnlocked]);

    // Trigger paso 2: Pico
    useEffect(() => {
        if (gameState.tutorial?.staminaUpgradeDone &&
            gameState.tutorial?.currentStep === 2 &&
            !gameState.tutorial?.pickaxeUnlocked) {

            setTutorialStep(2);
            handleUnlockTutorialFeature('pickaxe');
        }
    }, [gameState.tutorial?.staminaUpgradeDone, gameState.tutorial?.currentStep, gameState.tutorial?.pickaxeUnlocked]);

    // ✅ Función para mostrar número flotante en HUD oro
    const showGoldCost = (cost) => {
        const id = Date.now();
        setGoldFloatingNumbers(prev => [...prev, {
            id: id,
            value: -cost,  // Negativo
            timestamp: Date.now()
        }]);

        setTimeout(() => {
            setGoldFloatingNumbers(prev => prev.filter(n => n.id !== id));
        }, 1500);
    };


    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 10000) return (num / 1000).toFixed(1) + 'k';
        return num;
    };

    // ===== RENDER =====
    return (
        <div className="game-container" style={{ backgroundImage: `url(${bgMain})` }}>

            {/* OVERLAY TUTORIAL */}
            {tutorialStep !== null && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.85)',
                    zIndex: 500,
                    pointerEvents: 'none'
                }} />
            )}

            {/* HEADER */}
            <div className="gold-menu-display">
                <div className="gold-display">

                    <div className="gold-cont" style={{ position: 'relative' }}>
                        <img src={cofre} alt="Cofre Oro" />
                        <p>{formatNumber(gameState.gold)}</p>

                        {/* ✅ NÚMEROS FLOTANTES */}
                        {goldFloatingNumbers.map(num => (
                            <div
                                key={num.id}
                                className="floating-gold-cost"
                            >
                                {num.value}
                            </div>
                        ))}


                        <div className="cont-coinTavern">

                            <div className="container-coinTavern">
                                <img src={coinTavern} alt="Coin-Tavern" />
                                <span>{gameState.tavernCoins}</span>
                            </div>
                        </div>

                    </div>
                    <div>
                        <button onClick={() => setMenuOpenModal(prev => !prev)}><Settings /></button>
                    </div>

                </div>

                <ModalsMenu
                    isOpen={menuOpenModal}
                    onClose={() => setMenuOpenModal(false)}
                    button1={() => { handleNewGame(); }}
                    textButton={"newGame"}
                />

            </div>


            {/* HUD */}
            <div className="game-info">

                {/* ORO/SEGUNDO */}
                <div className="gold-per-sec" >
                    <img className="img-goldSec" src={gold} alt="Oro" />
                    <p>+{gameState.goldPerSecond}</p>

                    <button
                        onClick={() => {
                            setTutorialStep(null);
                            setOpenModal("goldPerSecond");
                        }}
                        className={`openDisplay1 ${tutorialStep === 0 ? 'tutorial-highlight' : ''}`}
                        style={{ position: 'relative' }}
                    >
                        +
                        {tutorialStep === 0 && <TutorialPointer step={0} />}
                    </button>
                </div>

                <UpgradeModal
                    isOpen={openModal === "goldPerSecond"}
                    onClose={() => setOpenModal(null)}
                    currentLevel={`x${gameState.goldPerSecondLevel}`}
                    cost={gameState.goldPerSecondCost}
                    onUpgrade={() => {
                        handleBuyGoldPerSecondUpgrade();
                        if (gameState.tutorial?.currentStep === 0) setOpenModal(null);
                    }}
                    canAfford={gameState.gold >= gameState.goldPerSecondCost}
                    tutorialStep0Active={gameState.tutorial?.currentStep === 0 && !gameState.tutorial?.goldPerSecondBought}
                    tutorialMessage={(gameState.tutorial?.currentStep === 0 && !gameState.tutorial?.goldPerSecondBought) ? " 👉" : null}
                    bgImage={bgGold}
                    iconImage={iconGold}
                    buttonImage={buttonUpgrade}

                    showSnacks={true}
                    snacksData={gameState.snacks}
                    tavernCoins={gameState.tavernCoins}
                    onUnlockSnack={handleUnlockSnack}
                    onUpgradeSnack={handleUpgradeSnack}
                    onUseSnack={handleUseSnack}
                />

                {/* STAMINA */}
                <div className="stamina-display">
                    <button
                        onClick={() => {
                            setTutorialStep(null);
                            setOpenModal("maxStamina");
                        }}
                        disabled={!gameState.tutorial?.staminaUnlocked && !gameState.tutorial?.completed}
                        className={`${gameState.stamina <= 5 ? 'low-resource' : ''} ${tutorialStep === 1 ? 'tutorial-highlight' : ''}`}
                        style={{
                            position: 'relative',
                            opacity: (!gameState.tutorial?.staminaUnlocked && !gameState.tutorial?.completed) ? 0.5 : 1,
                            cursor: (!gameState.tutorial?.staminaUnlocked && !gameState.tutorial?.completed) ? 'not-allowed' : 'pointer',
                            filter: (!gameState.tutorial?.staminaUnlocked && !gameState.tutorial?.completed) ? 'grayscale(100%)' : 'none'
                        }}
                    >
                        <img src={stamina} loading='lazy' alt="Stamina" />
                        {tutorialStep === 1 && <TutorialPointer step={1} />}
                    </button>

                    <p>{gameState.stamina}/{gameState.maxStamina}</p>

                    <button
                        onClick={() => {
                            const cost = gameState.staminaRefillCost;
                            if (gameState.gold >= cost) {
                                showGoldCost(cost);  // ✅ Muestra -100
                                handleRefillStamina();
                            }
                            setOpenModal(null);
                        }}
                        disabled={gameState.automine?.isActive || gameState.stamina >= gameState.maxStamina}
                        className={`openDisplay2 ${gameState.stamina <= 5 ? 'low-resource-green' : ''}`}
                    >
                        +
                    </button>

                </div>

                <UpgradeModal
                    isOpen={openModal === "maxStamina"}
                    onClose={() => {
                        setOpenModal(null);
                        setTutorialStep(null);

                    }}
                    currentLevel={`lvl ${gameState.maxStaminaLevel}`}
                    cost={gameState.tutorial?.staminaUpgradeDone ? gameState.maxStaminaCost : 0}
                    onUpgrade={() => { handleBuyMaxStaminaUpgrade(); }}
                    canAfford={true}

                    showRefill={gameState.stamina < gameState.maxStamina}
                    refillCost={`Recargar: ${gameState.staminaRefillCost}`}
                    onRefill={() => { handleRefillStamina(); setOpenModal(null); }}
                    canAffordRefill={gameState.gold >= gameState.staminaRefillCost}
                    tutorialMessage={!gameState.tutorial?.staminaUpgradeDone ? " 👉" : null}
                    bgImage={bgStamina}
                    iconImage={upgradeStamina}
                    buttonImage={buttonUpgrade}
                    refillButtonImage={refillStamina}
                />

                {/* PICO */}
                <div className="pickaxe-display">
                    <button
                        onClick={() => {
                            setTutorialStep(null);
                            setOpenModal("pickaxe");
                        }}
                        disabled={!gameState.tutorial?.pickaxeUnlocked && !gameState.tutorial?.completed}
                        className={`${gameState.pickaxe.durability <= 5 ? 'low-resource' : ''} ${tutorialStep === 2 ? 'tutorial-highlight' : ''}`}
                        style={{
                            position: 'relative',
                            opacity: (!gameState.tutorial?.pickaxeUnlocked && !gameState.tutorial?.completed) ? 0.5 : 1,
                            cursor: (!gameState.tutorial?.pickaxeUnlocked && !gameState.tutorial?.completed) ? 'not-allowed' : 'pointer',
                            filter: (!gameState.tutorial?.pickaxeUnlocked && !gameState.tutorial?.completed) ? 'grayscale(100%)' : 'none'
                        }}
                    >
                        <img src={pickAxe} loading='lazy' alt="Pickaxe" />
                        {tutorialStep === 2 && <TutorialPointer step={2} />}
                    </button>

                    <p>{gameState.pickaxe.durability}/{gameState.pickaxe.maxDurability}</p>

                    <button
                        onClick={() => {
                            const cost = gameState.pickaxe.repairCost;
                            if (gameState.gold >= cost) {
                                showGoldCost(cost);  // ✅ Muestra -50 (o lo que cueste)
                                handleRepairPickaxe();
                            }
                            setOpenModal(null);
                        }}
                        disabled={gameState.automine?.isActive || gameState.pickaxe.durability >= gameState.pickaxe.maxDurability}
                        className={`openDisplay3 ${gameState.pickaxe.durability <= 5 ? 'low-resource-green' : ''}`}
                    >
                        +
                    </button>
                </div>

                <UpgradeModal
                    isOpen={openModal === "pickaxe"}
                    onClose={() => {
                        setOpenModal(null);
                        setTutorialStep(null);
                    }}

                    currentLevel={`Tier ${gameState.pickaxe.tier}`}
                    cost={gameState.tutorial?.pickaxeUpgradeDone ? gameState.pickaxe.tierUpgradeCost : 0}
                    onUpgrade={handlePickaxeUpgrade}
                    canAfford={true}
                    showRefill={gameState.pickaxe.durability < gameState.pickaxe.maxDurability}
                    refillCost={`Reparar: ${gameState.pickaxe.repairCost}`}
                    onRefill={() => { handleRepairPickaxe(); setOpenModal(null); }}
                    canAffordRefill={canRepairPickaxe}
                    tutorialMessage={!gameState.tutorial?.pickaxeUpgradeDone ? " 👉" : null}
                    buttonImage={btnTier}
                    iconImage={getPickaxeIcon(gameState.pickaxe.material)}
                    bgImage={bgPickaxe}
                    refillButtonImage={repairPickaxe}
                    isPickaxe={true}
                    pickaxeTier={gameState.pickaxe.tier}
                    pickaxeMaterial={gameState.pickaxe.material}
                    onUpgradeMaterial={handleUpgradePickaxeMaterial}
                    materialCost={gameState.pickaxe.materialUpgradeCost}
                    canAffordMaterial={canAffordMaterialUpgrade}
                    materialButtonImage={PickAxeUp}


                />
            </div>

            {/* ORES */}
            <div className="cont-hud-ores">
                <div className="cont-ore" style={{ position: 'relative' }}>
                    <p>{gameState.bronze}</p>
                    <img src={bronze1} alt="Bronze" />
                    {oreFloatingNumbers.filter(n => n.type === 'bronze').map(n => (
                        <div key={n.id} className="floating-gold-cost" style={{ color: '#CD7F32' }}>+{n.value}</div>
                    ))}
                </div>
                <div className="cont-ore" style={{ position: 'relative' }}>
                    <p>{gameState.iron}</p>
                    <img src={metal1} alt="Metal" />
                    {oreFloatingNumbers.filter(n => n.type === 'iron').map(n => (
                        <div key={n.id} className="floating-gold-cost" style={{ color: '#808080' }}>+{n.value}</div>
                    ))}
                </div>
                <div className="cont-ore" style={{ position: 'relative' }}>
                    <p>{gameState.diamond}</p>
                    <img src={diamond1} alt="Diamante" />
                    {oreFloatingNumbers.filter(n => n.type === 'diamond').map(n => (
                        <div key={n.id} className="floating-gold-cost" style={{ color: '#B9F2FF' }}>+{n.value}</div>
                    ))}
                </div>
            </div>

            <div className="cont-screens">
                {/* taberna */}
                <div className="modal-tavern">
                    {gameState.tavernUnlocked ? (
                        <button onClick={() => setTavernModalOpen(true)} className="tavern-btn">
                            <img src={iconTavern} alt="Icono-Taberna" />
                        </button>
                    ) : (
                        <button onClick={handleUnlockTavern} disabled={gameState.gold < 1000} className="tavern-btn tavern-locked">
                            <img src={iconTavern} alt="Icono-Taberna" />
                            <span>🔒 3000 oro</span>
                        </button>
                    )}
                </div>

                {/* MINAS */}
                <div className="modal-mine">
                    {gameState.minesMapUnlocked ? (
                        <button onClick={() => setMinesModalOpen(true)} className="mines-map-btn">
                            <img src={mineModal} alt="Icon1" />
                        </button>
                    ) : (
                        <button onClick={handleUnlockMinesMap} disabled={gameState.gold < 1000} className="mines-map-btn mines-map-locked">
                            <img src={mineModal} alt="Icon1" />
                            <span>🔒 2000 oro</span>
                        </button>
                    )}
                </div>


                {/* FORGE */}
                <div className="modal-forge">
                    <button onClick={() => setForgeModalOpen(true)} className="forge-btn">
                        <img src={iconForge} alt="Icon-Forge" />
                    </button>
                </div>
            </div>


            {/* AUTOMINE */}

            <div className="automine-container">
                {!gameState.automine?.unlocked ? (
                    <button
                        onClick={handleUnlockAutomine}
                        disabled={gameState.gold < AutomineConfig.unlockCost}
                        className="automine-button unlock"
                    >
                        <img src={activeMine} alt="Pico" />
                        <span>🔒 {AutomineConfig.unlockCost} oro</span>
                    </button>
                ) : (
                    <button
                        onClick={gameState.automine.isActive ? handleStopAutomine : handleActivateAutomine}
                        disabled={!gameState.automine.isActive && (availableCharges <= 0 || gameState.stamina <= 0 || gameState.pickaxe.durability <= 0)}
                        className={`automine-button-pico charges-${availableCharges}`}
                        style={{
                            '--progress1': chargeTimers[0] ? `${Math.round((1 - chargeTimers[0] / AutomineConfig.chargeRecoveryTime) * 100) * 3.6}deg` : '0deg',
                            '--progress2': chargeTimers[1] ? `${Math.round((1 - chargeTimers[1] / AutomineConfig.chargeRecoveryTime) * 100) * 3.6}deg` : '0deg',
                        }}
                    >
                        <img src={gameState.automine.isActive ? stopMine : activeMine} alt="Pico" />
                        <span className="automine-charge-count">{availableCharges}/2</span>
                    </button>
                )}
            </div>


            <MinesMapModal
                isOpen={minesModalOpen}
                onClose={() => setMinesModalOpen(false)}
                unlockedTypes={gameState.mines.unlockedTypes}
                bestScores={gameState.mines.bestScores}
                minesConfig={MinesConfig}
                onUnlockType={(type) => { handleUnlockMineType(type); }}
                onEnterMine={(type) => { handleEnterMine(type); setMinesModalOpen(false); setIsMineScreenOpen(true); }}
                onDiscardMine={handleDiscardMine}
                currentGold={gameState.gold}
                currentPickaxeMaterial={gameState.pickaxe.material}
            />

            <MineScreen
                isOpen={isMineScreenOpen}
                onClose={() => { handleExitMine(); setIsMineScreenOpen(false); }}
                currentMine={gameState.mines.currentMine}
                onMineVein={handleMineVein}
                pickaxeMaterial={gameState.pickaxe.material}
                canMine={gameState.stamina > 0 && gameState.pickaxe.durability > 0}
            />

            <TavernModal
                isOpen={tavernModalOpen}
                onClose={() => setTavernModalOpen(false)}
                bronzeIngot={gameState.bronzeIngot}
                ironIngot={gameState.ironIngot}
                diamondIngot={gameState.diamondIngot}
                bronze={gameState.bronze}
                iron={gameState.iron}
                diamond={gameState.diamond}
                tavernCoins={gameState.tavernCoins}
                onConvert={handleConvertMaterial}
                onConvertCoins={handleConvertCoinsToGold}
            />

            <ForgeModal
                isOpen={forgeModalOpen}
                onClose={() => setForgeModalOpen(false)}
                gameState={gameState}
                onUnlockFurnace={handleUnlockFurnace}
                onStartSmelt={handleStartSmelt}
                onCollectIngot={handleCollectIngot}
                onUpgradeFurnace={handleUpgradeFurnace}

            />

            {/* GOLD MINE */}
            <GoldMine
                onMineClick={handleMineClick}
                goldPerMine={gameState.goldPerMine}
                canMine={gameState.stamina > 0 && gameState.pickaxe.durability > 0}
                currentCombo={gameState.comboCount}
                comboMilestones={gameState.comboMilestones}
            />


        </div>
    );
}

export default GameRoot;