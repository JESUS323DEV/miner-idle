import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import RunnerScreen from '../modalRunner/RunnerScreen.jsx';
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
                <CurrencyHud gold={gameState.gold} tavernCoins={gameState.tavernCoins} huesin={gameState.huesin} />
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
            <CurrencyHud gold={gameState.gold} tavernCoins={gameState.tavernCoins} huesin={gameState.huesin} />
            <RunnerScreen belowHud />
        </>
    );
};

export default LadyRunStandalone;
