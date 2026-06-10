import { useState } from "react";
import { X, ArrowLeft, User, Code2, Calendar, Layers, Instagram, Globe, RefreshCw, Info, Rocket, Swords, Cookie, WifiOff, CalendarClock, Cloud, Settings, PawPrint, Volume2, VolumeX } from "lucide-react";
import "../../styles/modals/ModalsMenu.css";

const SettingsModal = ({ isOpen, onClose, onNewGame, musicEnabled, musicVolume, onMusicToggle, onMusicVolume, sfxEnabled, sfxVolume, onSfxToggle, onSfxVolume }) => {
    const [view, setView] = useState("main");
    if (!isOpen) return null;

    const handleNewGame = () => {
        onNewGame();
        onClose();
    };

    return (
        <div className="settings-overlay">
            <div className="settings-panel" onClick={e => e.stopPropagation()}>

                {(view === 'main' || view === 'confirm') && (
                    <div className="settings-header">
                        <span className="settings-title"><Settings size={16} /> Ajustes</span>
                        <button className="settings-close" onClick={() => { setView("main"); onClose(); }}><X size={18} /></button>
                    </div>
                )}

                {/* VISTA PRINCIPAL */}
                {view === "main" && (
                    <div className="settings-list">
                        <div className="settings-item settings-item-music">
                            <span className="settings-item-icon">
                                {musicEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                            </span>
                            <span className="settings-item-label">Música</span>
                            <button
                                className={`music-toggle ${musicEnabled ? 'music-toggle-on' : ''}`}
                                onClick={() => onMusicToggle(!musicEnabled)}
                            />
                        </div>
                        {musicEnabled && (
                            <div className="settings-item settings-item-volume">
                                <input
                                    type="range"
                                    min={0.01}
                                    max={0.5}
                                    step={0.01}
                                    value={musicVolume}
                                    onChange={e => onMusicVolume(parseFloat(e.target.value))}
                                    className="volume-slider"
                                />
                            </div>
                        )}
                        <div className="settings-item settings-item-music">
                            <span className="settings-item-icon">
                                {sfxEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                            </span>
                            <span className="settings-item-label">Efectos</span>
                            <button
                                className={`music-toggle ${sfxEnabled ? 'music-toggle-on' : ''}`}
                                onClick={() => onSfxToggle(!sfxEnabled)}
                            />
                        </div>
                        {sfxEnabled && (
                            <div className="settings-item settings-item-volume">
                                <input
                                    type="range"
                                    min={0.01}
                                    max={1}
                                    step={0.01}
                                    value={sfxVolume}
                                    onChange={e => onSfxVolume(parseFloat(e.target.value))}
                                    className="volume-slider"
                                />
                            </div>
                        )}
                        <button className="settings-item" onClick={() => setView("confirm")}>
                            <span className="settings-item-icon"><RefreshCw size={18} /></span>
                            <span className="settings-item-label">Nuevo juego</span>
                        </button>
                        <button className="settings-item" onClick={() => setView("about")}>
                            <span className="settings-item-icon"><Info size={18} /></span>
                            <span className="settings-item-label">Sobre el juego</span>
                        </button>
                        <button className="settings-item" onClick={() => setView("features")}>
                            <span className="settings-item-icon"><Rocket size={18} /></span>
                            <span className="settings-item-label">Próximamente</span>
                        </button>
                    </div>
                )}

                {/* CONFIRMACIÓN NUEVO JUEGO */}
                {view === "confirm" && (
                    <div className="settings-subview">
                        <p className="settings-warn-text">¿Seguro que quieres empezar de nuevo? Se perderá toda la partida actual.</p>
                        <div className="settings-row">
                            <button className="settings-btn-cancel" onClick={() => setView("main")}>Cancelar</button>
                            <button className="settings-btn-danger" onClick={handleNewGame}>Sí, reiniciar</button>
                        </div>
                    </div>
                )}

                {/* SOBRE EL JUEGO */}
                {view === "about" && (
                    <div className="settings-subview">
                        <div className="settings-header">
                            <button className="settings-close" onClick={() => setView("main")}><ArrowLeft size={18} /></button>
                            <span className="settings-title">Sobre el juego</span>
                        </div>
                        <div className="settings-about-title"><PawPrint size={18} /> Lady Hungry <span className="settings-about-version">v2.1</span></div>
                        <p className="settings-about-desc">
                            Lady Hungry nació como un proyecto de prácticas en React y terminó convirtiéndose en un juego de minería, progresión y gestión de recursos.
                            Mejora tu pico, explora minas, funde materiales en la forja, consigue mascotas con habilidades únicas y desarrolla una red de producción capaz de generar riquezas incluso cuando no estés minando.
                        </p>

                        <div className="about-section">
                            <div className="about-section-title">
                                <User size={14} /> Creador:
                            </div>

                            <div className="about-section-body">
                                <div className="about-links">
                                    <a className="about-link" href="https://www.instagram.com/jesussdev/" target="_blank" rel="noreferrer"><Instagram size={13} /> jesussdev</a>
                                    <a className="about-link" href="https://webjesusdev.netlify.app/" target="_blank" rel="noreferrer"><Globe size={13} /> webjesusdev</a>
                                </div>
                            </div>
                        </div>
                        <div className="about-section">
                            <div className="about-section-title"><Calendar size={14} /> Inicio:</div>
                            <div className="about-section-body">Febrero 2026 - Actualmente</div>
                        </div>

                        <div className="about-section">
                            <div className="about-section-title"><Code2 size={14} /> Stack:</div>
                            <div className="about-section-body about-tags">
                                <span className="about-tag">React 19</span>
                                <span className="about-tag">Vite</span>
                                <span className="about-tag">JavaScript</span>
                                <span className="about-tag">CSS</span>
                            </div>
                        </div>


                        <div className="about-section">
                            <div className="about-section-title"><Layers size={14} /> Sistemas:</div>
                            <div className="about-section-body about-tags">
                                <span className="about-tag">Minería</span>
                                <span className="about-tag">Forja</span>
                                <span className="about-tag">Taberna</span>
                                <span className="about-tag">Mascotas</span>
                                <span className="about-tag">Sobres</span>
                                <span className="about-tag">Raids</span>
                                <span className="about-tag">Recompensas</span>
                            </div>
                        </div>

                    </div>
                )}

                {/* PRÓXIMAMENTE */}
                {view === "features" && (
                    <div className="settings-subview">
                        <div className="settings-header">
                            <button className="settings-close" onClick={() => setView("main")}><ArrowLeft size={18} /></button>
                            <span className="settings-title">Próximamente</span>
                        </div>
                        <p className="settings-subview-label">En desarrollo</p>
                        <div className="features-list">
                            <div className="feature-item">
                                <span className="feature-icon"><Swords size={20} /></span>
                                <div className="feature-info">
                                    <span className="feature-name">Raids activas</span>
                                    <span className="feature-desc">Combate en tiempo real con tu equipo de mascotas.</span>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon"><Cookie size={20} /></span>
                                <div className="feature-info">
                                    <span className="feature-name">Snacks</span>
                                    <span className="feature-desc">Mejoras temporales para la minería, la forja y más.</span>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon"><Layers size={20} /></span>
                                <div className="feature-info">
                                    <span className="feature-name">Mejoras de UX/UI</span>
                                    <span className="feature-desc">Pulido visual, animaciones y mejoras generales de experiencia.</span>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon"><WifiOff size={20} /></span>
                                <div className="feature-info">
                                    <span className="feature-name">Recompensas offline</span>
                                    <span className="feature-desc">Gana recursos mientras no juegas.</span>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon"><CalendarClock size={20} /></span>
                                <div className="feature-info">
                                    <span className="feature-name">Eventos temporales</span>
                                    <span className="feature-desc">Desafíos y recompensas exclusivas por tiempo limitado.</span>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon"><Cloud size={20} /></span>
                                <div className="feature-info">
                                    <span className="feature-name">Guardado en la nube</span>
                                    <span className="feature-desc">Tu partida sincronizada en todos tus dispositivos.</span>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon"><Volume2 size={20} /></span>
                                <div className="feature-info">
                                    <span className="feature-name">Sonidos</span>
                                    <span className="feature-desc">Efectos de sonido y música para la experiencia de juego.</span>
                                </div>
                            </div>


                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default SettingsModal;
