import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import RunnerScreen from '../modalRunner/RunnerScreen.jsx';
import { getHuntRotationKey } from '../../game/config/TablonHuntConfig.js';
import SkinShopModal from '../modalRaid/SkinShopModal.jsx';
import CurrencyHud from '../../components/CurrencyHud.jsx';
import { loadSavedState } from '../../game/initialState/loadSavedState.js';
import { usePreloadImages, prefetchImages } from '../../game/hooks/usePreloadImages.js';
import { RUNNER_CORE_PRELOAD_IMAGES, RUNNER_HISTORIA_PRELOAD_IMAGES } from '../modalRunner/runnerPreloadAssets.js';
import { SKIN_SHOP_PRELOAD_IMAGES } from '../modalRaid/skinShopPreloadAssets.js';
import { useBackgroundMusic } from '../../game/hooks/useBackgroundMusic.js';
import '../../styles/standalone/LadyRunStandalone.css';

/**
 * Acceso independiente a Lady Run (?lady-run), sin cargar el resto de Pata y Pico.
 * Mismo guardado (localStorage "ladyHungryGame") que el juego completo, así que
 * moneda y skins se comparten entre este acceso y el juego normal.
 */
const LadyRunStandalone = () => {
    const [gameState, setGameState] = useState(loadSavedState);
    const [view, setView] = useState('run'); // 'run' | 'skins'
    const loaded = usePreloadImages(RUNNER_CORE_PRELOAD_IMAGES);
    const musicVolume = (() => {
        const saved = localStorage.getItem('music_volume');
        return saved === null ? 0.08 : parseFloat(saved);
    })();
    useBackgroundMusic(musicVolume);

    useEffect(() => {
        localStorage.setItem('ladyHungryGame', JSON.stringify({ ...gameState, savedAt: Date.now() }));
    }, [gameState]);

    // Historia y la tienda de skins estan bloqueadas ahora mismo: no hace falta su contenido para
    // jugar, asi que se precarga de fondo (sin bloquear la pantalla) por si se desbloquean despues.
    useEffect(() => {
        if (!loaded) return;
        prefetchImages([...RUNNER_HISTORIA_PRELOAD_IMAGES, ...SKIN_SHOP_PRELOAD_IMAGES]);
    }, [loaded]);

    if (!loaded) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
            </div>
        );
    }

    if (view === 'skins') {
        return (
            <>
                <CurrencyHud chapas={gameState.chapas} tavernCoins={gameState.tavernCoins} huesin={gameState.huesin} />
                <div className="lady-run-standalone-skins">
                    <button className="lady-run-standalone-back" onClick={() => setView('run')}>
                        <ArrowLeft size={16} /> Volver a Lady Run
                    </button>
                    <SkinShopModal gameState={gameState} setGameState={setGameState} />
                </div>
            </>
        );
    }

    return (
        <>
            <CurrencyHud chapas={gameState.chapas} tavernCoins={gameState.tavernCoins} huesin={gameState.huesin} />
            <RunnerScreen
                belowHud
                onEarnTavernCoins={(amount) => setGameState(prev => ({ ...prev, tavernCoins: (prev.tavernCoins ?? 0) + amount }))}
                onEarnChapas={(amount) => setGameState(prev => ({ ...prev, chapas: (prev.chapas ?? 0) + amount }))}
                onEarnHuesin={(amount) => setGameState(prev => ({ ...prev, huesin: (prev.huesin ?? 0) + amount }))}
                chapas={gameState.chapas ?? 0}
                pendingHeartsBonus={gameState.ladyRunPendingHearts ?? 0}
                onConsumePendingHearts={() => setGameState(prev => ({ ...prev, ladyRunPendingHearts: 0 }))}
                onBuyItem={(itemId, price) => setGameState(prev => {
                    if ((prev.chapas ?? 0) < price) return prev;
                    if (itemId === 'corazon_extra') {
                        return { ...prev, chapas: prev.chapas - price, ladyRunPendingHearts: (prev.ladyRunPendingHearts ?? 0) + 1 };
                    }
                    return prev;
                })}
                fullLootRunsByDifficulty={(() => {
                    const key = getHuntRotationKey(gameState.debugDayOffset ?? 0);
                    const byDiff = gameState.ladyRunDailyRuns ?? {};
                    return {
                        facil: byDiff.facil?.rotationKey === key ? (byDiff.facil.count ?? 0) : 0,
                        medio: byDiff.medio?.rotationKey === key ? (byDiff.medio.count ?? 0) : 0,
                        dificil: byDiff.dificil?.rotationKey === key ? (byDiff.dificil.count ?? 0) : 0,
                    };
                })()}
                onGameOverRun={(diff) => setGameState(prev => {
                    const key = getHuntRotationKey(prev.debugDayOffset ?? 0);
                    const byDiff = prev.ladyRunDailyRuns ?? {};
                    const current = byDiff[diff]?.rotationKey === key ? byDiff[diff].count : 0;
                    return { ...prev, ladyRunDailyRuns: { ...byDiff, [diff]: { rotationKey: key, count: current + 1 } } };
                })}
                dailyTramosClaimedByDifficulty={(() => {
                    const key = getHuntRotationKey(gameState.debugDayOffset ?? 0);
                    const byDiff = gameState.ladyRunDailyTramos ?? {};
                    return {
                        facil: byDiff.facil?.rotationKey === key ? (byDiff.facil.count ?? 0) : 0,
                        medio: byDiff.medio?.rotationKey === key ? (byDiff.medio.count ?? 0) : 0,
                        dificil: byDiff.dificil?.rotationKey === key ? (byDiff.dificil.count ?? 0) : 0,
                    };
                })()}
                onClaimDailyTramos={(diff, count) => setGameState(prev => {
                    const key = getHuntRotationKey(prev.debugDayOffset ?? 0);
                    const byDiff = prev.ladyRunDailyTramos ?? {};
                    return { ...prev, ladyRunDailyTramos: { ...byDiff, [diff]: { rotationKey: key, count } } };
                })}
            />
        </>
    );
};

export default LadyRunStandalone;
