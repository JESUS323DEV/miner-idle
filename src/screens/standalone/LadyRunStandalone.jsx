import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import RunnerScreen from '../modalRunner/RunnerScreen.jsx';
import { getHuntRotationKey } from '../../game/config/TablonHuntConfig.js';
import SkinShopModal from '../modalRaid/SkinShopModal.jsx';
import CurrencyHud from '../../components/CurrencyHud.jsx';
import { loadSavedState } from '../../game/initialState/loadSavedState.js';
import { usePreloadImages } from '../../game/hooks/usePreloadImages.js';
import { RUNNER_PRELOAD_IMAGES } from '../modalRunner/runnerPreloadAssets.js';
import { SKIN_SHOP_PRELOAD_IMAGES } from '../modalRaid/skinShopPreloadAssets.js';
import '../../styles/standalone/LadyRunStandalone.css';

/**
 * Acceso independiente a Lady Run (?lady-run), sin cargar el resto de Pata y Pico.
 * Mismo guardado (localStorage "ladyHungryGame") que el juego completo, así que
 * moneda y skins se comparten entre este acceso y el juego normal.
 */
const LadyRunStandalone = () => {
    const [gameState, setGameState] = useState(loadSavedState);
    const [view, setView] = useState('run'); // 'run' | 'skins'
    const preloadList = useMemo(() => [...RUNNER_PRELOAD_IMAGES, ...SKIN_SHOP_PRELOAD_IMAGES], []);
    const loaded = usePreloadImages(preloadList);

    useEffect(() => {
        localStorage.setItem('ladyHungryGame', JSON.stringify({ ...gameState, savedAt: Date.now() }));
    }, [gameState]);

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
            />
        </>
    );
};

export default LadyRunStandalone;
