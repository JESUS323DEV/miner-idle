import { useState, useEffect } from 'react';
import '../../styles/modals/UpgradeModal.css';
import TutorialModalHint from './TutorialModalHint.jsx';

import { X } from "lucide-react";

import coinTavern from "../../assets/ui/icons-hud/hud-principal/coin-tavern1.webp"
import iconCookie from "../../assets/ui/icons-hud/hud-modals/cookie.webp"
import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.webp"

import { formatNumber } from '../../game/utils/formatters.js';
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

    // ===== TUTORIAL =====
    tutorialStep0Active = false,
    tutorialPhase = null,      // 'upgrade' | 'snacks' | null
    onTutorialAction = null,
    tutorialHint = null,       // key de MODAL_HINTS: 'goldPerSecond' | 'stamina'

    // ===== IMÁGENES =====
    bgImage,
    iconImage,
    buttonImage,

    // ===== SNACKS =====
    showSnacks = false,
    snacksData = null,
    tavernCoins = 0,
    onUnlockSnack = null,
    onUpgradeSnack = null,
    onUseSnack = null,
    showStaminaSnacks = false,

    coinCost,

    // ===== SEGUNDO UPGRADE (opcional) =====
    secondUpgrade = null, // { title, cost, onUpgrade, canAfford }

}) => {
    // Tick para forzar re-render del timer del snack cada segundo
    const [, setTick] = useState(0);

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


                    {/* ICONO + NIVEL + BOTÓN UPGRADE */}
                    <div className="modal-info">

                        <div className='gold-info'>
                            <img src={iconImage} loading='lazy' alt="icon" />
                            <p>{currentLevel}</p>
                        </div>

                        <div className='wrap-cont-stamina'>
                            <div className='cont-btn-upgrade'>
                                <p>{title}</p>
                                <button
                                    className={`btn-upgrade ${!canAfford ? "locked" : ""} ${tutorialPhase === 'upgrade' ? "tutorial-pulse" : ""}`}
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

                            {secondUpgrade && (
                                <div className='cont-btn-upgrade'>
                                    <p>{secondUpgrade.title}</p>
                                    <button
                                        className={`btn-upgrade ${!secondUpgrade.canAfford ? "locked" : ""}`}
                                        onClick={secondUpgrade.onUpgrade}
                                        disabled={!secondUpgrade.canAfford}
                                    >
                                        <img src={buttonImage} loading='lazy' alt="Upgrade" />
                                    </button>
                                    <span className='info-gold'>
                                        coste: {formatNumber(secondUpgrade.cost)}
                                        <img className='iconGold' src={iconGold} alt="Gold" />
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {tutorialPhase === 'upgrade' && <TutorialModalHint hint={tutorialHint} />}

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
                    {showStaminaSnacks && !snacksData && (
                        <div className="cont-snack-stamina">
                            <div className='snack1-stamina'><p>Snack Stamina (Próximamente)</p></div>
                            <div className='snack2-repair'><p>Snack (Próximamente)</p></div>
                        </div>
                    )}

                    {showStaminaSnacks && snacksData && (
                        <div className="cont-snack-stamina">
                            <div className='snack1-stamina'>
                                <div className='cont-cookie'>
                                    <div className='cont-text-img'>
                                        <p>Bebida Nv. {snacksData.drink?.level ?? 0}</p>
                                    </div>
                                </div>
                                {!snacksData.drink?.unlocked ? (
                                    <button
                                        onClick={() => onUnlockSnack('drink')}
                                        disabled={tavernCoins < 5}
                                        style={{ opacity: tavernCoins < 5 ? 0.5 : 1 }}
                                    >
                                        <span><small>Desbloquear x5</small><img src={coinTavern} alt="coin" /></span>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => onUseSnack('drink')}
                                            disabled={tavernCoins < 1 || snacksData.drink?.active !== null || Object.values(snacksData).some(s => s.active !== null)}
                                            style={{ opacity: (tavernCoins < 1 || snacksData.drink?.active !== null) ? 0.5 : 1 }}
                                        >
                                            {snacksData.drink?.active !== null && snacksData.drink?.active ? (() => {
                                                const { startTime, duration } = snacksData.drink.active;
                                                const remaining = Math.max(0, duration - Math.floor((Date.now() - startTime) / 1000));
                                                const mins = Math.floor(remaining / 60);
                                                const secs = remaining % 60;
                                                return <span>{mins}:{secs.toString().padStart(2, '0')}</span>;
                                            })() : <span>Usar x1 <img src={coinTavern} alt="usar" /></span>}
                                        </button>
                                        {snacksData.drink?.level < 3 && (
                                            <button
                                                onClick={() => onUpgradeSnack('drink')}
                                                disabled={tavernCoins < (snacksData.drink.level === 1 ? 10 : 15)}
                                                style={{ opacity: tavernCoins < (snacksData.drink.level === 1 ? 10 : 15) ? 0.5 : 1 }}
                                            >
                                                Mejorar x{snacksData.drink.level === 1 ? 10 : 15}
                                                <img src={coinTavern} alt="coin" />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className='snack2-repair'>
                                <p>Snack (Próximamente)</p>
                            </div>
                        </div>
                    )}


                    {/* ===== SNACKS — solo modal de oro ===== */}
                    {showSnacks && snacksData && (
                        <div className="cont-snacks">

                            {/* GALLETA */}
                            <div className='container-snacks'>
                                <div className={`snack1 ${tutorialPhase === 'snacks' ? 'tutorial-pulse' : ''}`}>
                                    {tutorialPhase === 'snacks' && (
                                        <span className="tutorial-hand-above">👇</span>
                                    )}

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

                    {tutorialPhase === 'snacks' && <TutorialModalHint hint="goldPerSecondSnacks" onAction={onTutorialAction} />}

                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;