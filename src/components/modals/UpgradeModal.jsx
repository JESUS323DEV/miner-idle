import { useState, useEffect } from 'react';
import '../../styles/modals/UpgradeModal.css';

import { X } from "lucide-react";

import coinTavern from "../../assets/ui/icons-hud/hud-principal/coin-tavern1.png"
import iconCookie from "../../assets/ui/icons-hud/hud-modals/cookie.png"
import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.png"

const formatNumber = (num) => {
    if (num >= 1000000) return Number((num / 1000000).toFixed(1)) + 'M';
    if (num >= 1000) return Number((num / 1000).toFixed(1)) + 'k';
    return num;
};
/**
 * COMPONENTE: UpgradeModal
 * Modal reutilizable para oro/segundo y stamina
 */
const UpgradeModal = ({

    // ===== PROPS BÁSICAS =====
    isOpen,              // Si el modal está abierto
    onClose,             // Cierra el modal
    title,               // Título del modal
    currentLevel,        // Nivel actual (ej: "x4", "lvl 10")
    cost,                // Coste del upgrade
    onUpgrade,           // Ejecuta el upgrade
    canAfford,           // Si puede pagar el upgrade

    // ===== REFILL (stamina) =====
    showRefill,          // Si muestra botón de recargar
    refillCost,          // Texto del coste (ej: "Recargar: 60 Oro")
    onRefill,            // Ejecuta la recarga
    canAffordRefill,     // Si puede pagar la recarga

    // ===== TUTORIAL =====
    tutorialStep0Active = false,
    tutorialMessage = null,

    // ===== IMÁGENES =====
    bgImage,             // Fondo del modal
    iconImage,           // Icono del upgrade
    buttonImage,         // Imagen del botón principal
    refillButtonImage,   // Imagen del botón de refill

    // ===== SNACKS =====
    showSnacks = false,
    snacksData = null,
    tavernCoins = 0,
    onUnlockSnack = null,
    onUpgradeSnack = null,
    onUseSnack = null,
    showStaminaSnacks = false,

    coinCost,


}) => {
    // Tick para actualizar el timer del snack cada segundo
    const [tick, setTick] = useState(0);

    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        // Overlay oscuro — click fuera cierra el modal
        <div className="modal-overlay" onClick={tutorialStep0Active ? undefined : onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className='modal'>

                    {/* BOTÓN CERRAR — oculto en tutorial paso 0 */}
                    {(!tutorialStep0Active) && (
                        <button className="modal-close" onClick={onClose}>
                            <X />
                        </button>
                    )}

                    {/* TUTORIAL POINTER */}
                    {tutorialMessage && (
                        <div className='title-modal'>
                            <p>{tutorialMessage}</p>
                        </div>
                    )}

                    {/* ICONO + NIVEL + BOTÓN UPGRADE */}
                    <div className="modal-info">

                        <div className='gold-info'>
                            <img src={iconImage} loading='lazy' alt="icon" />
                            <p>{currentLevel}</p>
                        </div>

                        <div className='cont-btn-upgrade'>
                            <p>{title}</p>
                            <button
                                className={`btn-upgrade ${!canAfford ? "locked" : ""}`}
                                onClick={onUpgrade}
                                disabled={!canAfford}
                            >
                                <img src={buttonImage} loading='lazy' alt="Upgrade" />


                            </button>
                            <span className='info-gold'>
                                coste: {formatNumber(cost)}
                                <img className='iconGold' src={iconGold} alt="Gold" />
                                {coinCost !== undefined && (
                                    <> {coinCost} <img className='iconGold2' src={coinTavern} alt="coinTavern" /></>
                                )}
                            </span>

                        </div>
                    </div>

                    {/* BOTÓN REFILL — solo stamina 
                    {showRefill && (
                        <button
                            className={`refill-btn-modal ${!canAffordRefill ? "locked" : ""}`}
                            onClick={onRefill}
                            disabled={!canAffordRefill}
                        >
                            <img src={refillButtonImage} loading='lazy' alt="Recargar" />
                            <p>{refillCost} Oro</p>
                        </button>
                    )}*/}


                    {/* SNACKS STAMINA — próximamente */}
                    {showStaminaSnacks && (
                        <div className="cont-snack-stamina">

                            <div className='snack1-stamina'>
                                <p>⚡Snack Stamina (Próximamente)</p>
                            </div>

                            <div className='snack2-repair'>
                                <p>⛏️ Snack Repair (Próximamente)</p>
                            </div>


                        </div>
                    )}


                    {/* ===== SNACKS — solo modal de oro ===== */}
                    {showSnacks && snacksData && (
                        <div className='cont-snacks'>

                            {/* GALLETA */}
                            <div className='container-snacks'>
                                <div className='snack1'>

                                    <div className='cont-cookie'>
                                        <div className='cont-text-img'>
                                            <img src={iconCookie} alt="icon-Cookie" />
                                            <p>Galleta Lvl {snacksData.cookie.level}</p>
                                        </div>
                                    </div>

                                    {/* Sin desbloquear → botón desbloquear */}
                                    {!snacksData.cookie.unlocked ? (
                                        <button
                                            onClick={() => onUnlockSnack('cookie')}
                                            disabled={tavernCoins < 5}
                                            style={{
                                                opacity: tavernCoins < (snacksData.cookie.level === 1 ? 10 : 15) ? 0.5 : 1,
                                            }}
                                        >
                                            <span>
                                                <small>Desbloquear x5</small>
                                                <img src={coinTavern} alt="coin-tavern" />
                                            </span>
                                        </button>

                                    ) : (
                                        <>
                                            {/* Desbloqueado → botón usar */}
                                            <button
                                                onClick={() => onUseSnack('cookie')}
                                                disabled={
                                                    tavernCoins < 1 ||
                                                    snacksData.cookie.active !== null ||
                                                    (snacksData.drink?.active !== null || snacksData.cake?.active !== null)
                                                }
                                                style={{
                                                    opacity: (tavernCoins < 1 || snacksData.cookie.active !== null) ? 0.5 : 1,
                                                }}
                                            >
                                                {/* Si buff activo → muestra timer, si no → botón usar */}
                                                {snacksData.cookie.active !== null ? (() => {
                                                    const { startTime, duration } = snacksData.cookie.active;
                                                    const remaining = Math.max(0, duration - Math.floor((Date.now() - startTime) / 1000));
                                                    const mins = Math.floor(remaining / 60);
                                                    const secs = remaining % 60;
                                                    return <span>{mins}:{secs.toString().padStart(2, '0')}</span>;
                                                })() : <span>Usar x1 <img src={coinTavern} alt="usar snack" /></span>}
                                            </button>

                                            {/* Botón mejorar — solo si nivel < 3 */}
                                            {snacksData.cookie.level < 3 && (
                                                <button
                                                    onClick={() => onUpgradeSnack('cookie')}
                                                    disabled={tavernCoins < (snacksData.cookie.level === 1 ? 10 : 15)}
                                                    style={{
                                                        opacity: tavernCoins < (snacksData.cookie.level === 1 ? 10 : 15) ? 0.5 : 1,
                                                    }}
                                                >
                                                    <span className='mejorar-snack'>
                                                        Mejorar {snacksData.cookie.level === 1 ? 10 : 15}
                                                        <img src={coinTavern} alt="coin" />
                                                    </span>
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* BEBIDA — placeholder */}
                                <div className='snack2'>
                                    <p>🥤 Bebida (Próximamente)</p>
                                </div>

                                {/* PASTEL — placeholder (comentado)
                                <div style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    opacity: 0.5
                                }}>
                                    <p style={{ color: '#888' }}>🍰 Pastel (Próximamente)</p>
                                </div>
                                */}
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;