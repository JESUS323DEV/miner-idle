import { useState } from "react";
import { X, ArrowLeft, User, Code2, Calendar, Layers, Instagram, Globe, RefreshCw, Info, Rocket, Swords, Cookie, WifiOff, CalendarClock, Cloud, Settings, PawPrint, Volume2, VolumeX, Palette, Monitor, Sparkles, ImagePlay, Flame, Loader } from "lucide-react";
import "../../styles/modals/ModalsMenu.css";

const SettingsModal = ({ isOpen, onClose, onNewGame, musicVolume, onMusicVolume, sfxVolume, onSfxVolume }) => {
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
                                onChange={e => onMusicVolume(parseFloat(e.target.value))}
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
                                onChange={e => onSfxVolume(parseFloat(e.target.value))}
                                className="volume-slider"
                            />
                        </div>
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
                        <div className="settings-about-title"><PawPrint size={18} /> Pata y Pico <span className="settings-about-version">v2.1</span></div>
                        <p className="settings-about-desc">
                            Pata y Pico nació como un proyecto de prácticas en React y terminó convirtiéndose en un juego de minería, progresión y gestión de recursos.
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
                                <span className="about-tag">Y más por descubrir...</span>
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
                        <div className="features-sections">

                            <details className="feature-category">
                                <summary className="feature-category-summary"><Swords size={14} /> Gameplay</summary>
                                <div className="features-list">
                                    <div className="feature-item">
                                        <span className="feature-icon"><Swords size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Raids activas</span>
                                            <span className="feature-desc">Combate en tiempo real con tu equipo de mascotas.</span>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-icon"><PawPrint size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Sinergias</span>
                                            <span className="feature-desc">Combinaciones entre mascotas que potencian habilidades únicas.</span>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-icon"><Cookie size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Snacks</span>
                                            <span className="feature-desc">Mejoras temporales para la minería, la forja y más.</span>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-icon"><CalendarClock size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Eventos temporales</span>
                                            <span className="feature-desc">Desafíos y recompensas exclusivas por tiempo limitado.</span>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-icon"><Sparkles size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Ajuste de pasivas</span>
                                            <span className="feature-desc">Revisar y equilibrar las pasivas de perros, minas, forja y más.</span>
                                        </div>
                                    </div>
                                </div>
                            </details>

                            <details className="feature-category">
                                <summary className="feature-category-summary"><Monitor size={14} /> UX/UI</summary>
                                <div className="features-list">
                                    <div className="feature-item">
                                        <span className="feature-icon"><Layers size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Mejoras de UX/UI</span>
                                            <span className="feature-desc">Pulido de flujo, animaciones y experiencia general.</span>
                                        </div>
                                    </div>
                                </div>
                            </details>

                            <details className="feature-category">
                                <summary className="feature-category-summary"><Palette size={14} /> Diseño</summary>
                                <div className="features-list">
                                    <div className="feature-item">
                                        <span className="feature-icon"><Layers size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Rediseño de interiores</span>
                                            <span className="feature-desc">Mejorar la pantalla interior de minas, forja, raids y alquiler.</span>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-icon"><Flame size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Iconos de elementos</span>
                                            <span className="feature-desc">Unificar el estilo visual de los iconos de fuego, agua, tierra, etc.</span>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-icon"><Loader size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Pantalla de carga</span>
                                            <span className="feature-desc">Splash screen con logo y animación al iniciar el juego.</span>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-icon"><ImagePlay size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Animaciones de mascotas</span>
                                            <span className="feature-desc">Los perros en los slots con animación en vez de imagen estática.</span>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-icon"><Sparkles size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Tema visual por bioma</span>
                                            <span className="feature-desc">La UI cambia de paleta de color según el bioma activo (bronce, hierro, diamante).</span>
                                        </div>
                                    </div>
                                </div>
                            </details>

                            <details className="feature-category">
                                <summary className="feature-category-summary"><Volume2 size={14} /> SFX / Audio</summary>
                                <div className="features-list">
                                    <div className="feature-item">
                                        <span className="feature-icon"><Volume2 size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Mejorar audio y SFX</span>
                                            <span className="feature-desc">Ampliar y pulir los efectos de sonido y la música existentes.</span>
                                        </div>
                                    </div>
                                </div>
                            </details>

                            <details className="feature-category">
                                <summary className="feature-category-summary"><Cloud size={14} /> Online / Técnico</summary>
                                <div className="features-list">
                                    <div className="feature-item">
                                        <span className="feature-icon"><Cloud size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Guardado en la nube</span>
                                            <span className="feature-desc">Tu partida sincronizada en todos tus dispositivos.</span>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-icon"><Layers size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Clasificaciones</span>
                                            <span className="feature-desc">Compite con otros jugadores y escala en el ranking global.</span>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-icon"><WifiOff size={18} /></span>
                                        <div className="feature-info">
                                            <span className="feature-name">Recompensas offline</span>
                                            <span className="feature-desc">Gana recursos mientras no juegas.</span>
                                        </div>
                                    </div>
                                </div>
                            </details>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default SettingsModal;
