import { useState } from 'react';
import { Settings, X, Volume2 } from 'lucide-react';
import '../styles/modals/ModalsMenu.css';
import '../styles/components/LadyRunSoundSettings.css';

/**
 * Boton de ajustes de sonido de Lady Run (independiente de Pata y Pico, ver
 * feedback_limites_diarios_por_dificultad / sistemas aislados). Reutiliza el estilo visual del
 * panel de Ajustes de Pata y Pico (ModalsMenu.css) pero solo con musica/efectos, sin el resto del
 * menu (nuevo juego, sobre el juego...), y conectado a las claves propias music_volume_ladyrun /
 * sfx_volume_ladyrun.
 */
const LadyRunSoundSettings = () => {
    const [open, setOpen] = useState(false);
    const [musicVolume, setMusicVolume] = useState(() => {
        const saved = localStorage.getItem('music_volume_ladyrun');
        return saved === null ? 0.06 : parseFloat(saved);
    });
    const [sfxVolume, setSfxVolume] = useState(() => {
        const saved = localStorage.getItem('sfx_volume_ladyrun');
        return saved === null ? 0.09 : parseFloat(saved);
    });

    const handleMusicVolume = (value) => {
        setMusicVolume(value);
        localStorage.setItem('music_volume_ladyrun', String(value));
        window.dispatchEvent(new CustomEvent('ladyrun-music-volume', { detail: value }));
    };

    const handleSfxVolume = (value) => {
        setSfxVolume(value);
        localStorage.setItem('sfx_volume_ladyrun', String(value));
    };

    return (
        <>
            <button className="ladyrun-sound-btn" onClick={() => setOpen(true)}>
                <Settings size={18} />
            </button>
            {open && (
                <div className="settings-overlay ladyrun-settings-overlay" onClick={() => setOpen(false)}>
                    <div className="settings-panel ladyrun-settings-panel" onClick={e => e.stopPropagation()}>
                        <div className="settings-header">
                            <span className="settings-title"><Volume2 size={16} /> Sonido</span>
                            <button className="settings-close" onClick={() => setOpen(false)}><X size={18} /></button>
                        </div>
                        <div className="settings-list">
                            <div className="settings-item settings-item-music">
                                <span className="settings-item-icon"><Volume2 size={18} /></span>
                                <span className="settings-item-label">Música</span>
                            </div>
                            <div className="settings-item settings-item-volume">
                                <input
                                    type="range"
                                    min={0}
                                    max={0.5}
                                    step={0.01}
                                    value={musicVolume}
                                    onChange={e => handleMusicVolume(parseFloat(e.target.value))}
                                    className="volume-slider"
                                />
                            </div>
                            <div className="settings-item settings-item-music">
                                <span className="settings-item-icon"><Volume2 size={18} /></span>
                                <span className="settings-item-label">Efectos</span>
                            </div>
                            <div className="settings-item settings-item-volume">
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={sfxVolume}
                                    onChange={e => handleSfxVolume(parseFloat(e.target.value))}
                                    className="volume-slider"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LadyRunSoundSettings;
