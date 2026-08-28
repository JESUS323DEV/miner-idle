import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import RunnerScreen from '../modalRunner/RunnerScreen.jsx';
import SkinShopModal from '../modalRaid/SkinShopModal.jsx';
import { loadSavedState } from '../../game/initialState/loadSavedState.js';
import '../../styles/standalone/LadyRunStandalone.css';

/**
 * Acceso independiente a Lady Run (?lady-run), sin cargar el resto de Pata y Pico.
 * Mismo guardado (localStorage "ladyHungryGame") que el juego completo, así que
 * moneda y skins se comparten entre este acceso y el juego normal.
 */
const LadyRunStandalone = () => {
    const [gameState, setGameState] = useState(loadSavedState);
    const [view, setView] = useState('run'); // 'run' | 'skins'

    useEffect(() => {
        localStorage.setItem('ladyHungryGame', JSON.stringify({ ...gameState, savedAt: Date.now() }));
    }, [gameState]);

    if (view === 'skins') {
        return (
            <div className="lady-run-standalone-skins">
                <button className="lady-run-standalone-back" onClick={() => setView('run')}>
                    <ArrowLeft size={16} /> Volver a Lady Run
                </button>
                <SkinShopModal gameState={gameState} setGameState={setGameState} />
            </div>
        );
    }

    return <RunnerScreen onClose={() => setView('skins')} />;
};

export default LadyRunStandalone;
