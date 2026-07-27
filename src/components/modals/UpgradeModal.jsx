import { useState, useEffect } from 'react';
import '../../styles/modals/UpgradeModal.css';

import { X } from "lucide-react";

import coinTavern from "../../assets/ui/icons-hud/hud-principal/coin-tavern1.webp"

import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.webp"
import iconUnlock from "../../assets/ui/icons-hud/hud-modals/unlock.webp"
import iconOffline from "../../assets/ui/icons-hud/hud-modals/off-line.webp"
import iconOfflineRate2 from "../../assets/ui/icons-hud/hud-modals/off-line2.webp"
import iconStaminaRecharge from "../../assets/ui/icons-hud/hud-principal/stamina-2.webp"
import iconBurstPower from "../../assets/ui/icons-hud/hud-principal/stamina-3.webp"

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
    tutorialPhase = null,
    tutorialHint = null,
    hideDuringTutorial = false,

    // ===== IMÁGENES =====
    bgImage,
    iconImage,
    buttonImage,

    // ===== SNACKS =====
    snacksData = null,
    tavernCoins = 0,
    onUnlockSnack = null,
    onUpgradeSnack = null,
    onUseSnack = null,
    showStaminaSnacks = false,

    // ===== MEJORAS DE BURST (recarga / poder) =====
    burstRechargeLevel = 0,
    burstRechargeCost = 0,
    onUpgradeBurstRecharge = null,
    canAffordBurstRecharge = false,
    burstPowerLevel = 0,
    burstPowerCost = 0,
    onUpgradeBurstPower = null,
    canAffordBurstPower = false,

    coinCost,

    // ===== SEGUNDO UPGRADE (opcional) =====
    secondUpgrade = null,

    // ===== ORO OFFLINE =====
    offlineGoldLevel = -1,
    offlineGoldConfig = null,
    onUnlockOfflineGold = null,
    onUpgradeOfflineGold = null,
    canAffordOfflineGold = false,
    offlineHoursLevel = 0,
    offlineHoursMax = 30,
    offlineHoursNextCost = 0,
    onUpgradeOfflineRate2 = null,
    offlineRate2Level = 0,
    offlineRate2Max = 19,
    offlineRate2NextCost = 0,
    canAffordOfflineRate2 = false,

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
                            <img src={iconImage} alt="icon" />
                            <p className='info-gold'>{currentLevel}</p>
                        </div>

                        <div className='wrap-cont-stamina'>
                            <div className='cont-btn-upgrade'>
                                <p>{title}</p>
                                <button
                                    className={`btn-upgrade ${!canAfford ? "locked" : ""} ${tutorialPhase === 'upgrade' ? "tutorial-pulse" : canAfford ? "notify-pulse" : ""}`}
                                    onClick={onUpgrade}
                                    disabled={!canAfford}
                                    data-tutorial={tutorialHint === 'goldPerSecond' ? 'tut-gold-modal' : tutorialHint === 'stamina' ? 'tut-stamina-modal' : undefined}
                                >
                                    <img src={buttonImage} alt="Upgrade" />
                                </button>


                                <span className='info-gold'>
                                    {formatNumber(cost)}
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
                                        <img src={buttonImage} alt="Upgrade" />
                                    </button>
                                    <span className='info-gold'>
                                        coste: {formatNumber(secondUpgrade.cost)}
                                        <img className='iconGold' src={iconGold} alt="Gold" />
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* BOTÓN REFILL — solo stamina 
                    {showRefill && (
                        <button
                            className={`refill-btn-modal ${!canAffordRefill ? "locked" : ""}`}
                            onClick={onRefill}
                            disabled={!canAffordRefill}
                        >
                            <img src={refillButtonImage} alt="Recargar" />
                            <p>{refillCost} Oro</p>
                        </button>
                    )}*/}


                    {/* MEJORAS DE BURST — recarga y poder, ocultas durante el tutorial */}
                    {showStaminaSnacks && !snacksData && !hideDuringTutorial && (
                        <div className="cont-snacks">
                            <div className="container-snacks">
                                <div className="snack1">
                                    <div className="cont-cookie-2">
                                        <img src={iconStaminaRecharge} alt="recarga" />
                                    </div>

                                    <div className="text-cookie">
                                        <p>Recarga Nv. {burstRechargeLevel}</p>
                                        <small className="text-info">Reduce el tiempo de recarga del burst</small>
                                    </div>

                                    {burstRechargeLevel >= 55 ? (
                                        <p className="snack-max-level">Nivel máximo</p>
                                    ) : (
                                        <div className="cont-unlock-btn">
                                            <button
                                                className={canAffordBurstRecharge ? 'notify-pulse' : ''}
                                                onClick={onUpgradeBurstRecharge}
                                                disabled={!canAffordBurstRecharge}
                                            >
                                                <img className="snack-btn-img" src={buttonImage} alt="Mejorar" />
                                            </button>
                                            <span className="snack-btn-price">
                                                {formatNumber(burstRechargeCost)}
                                                <img src={iconGold} alt="gold" />
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="container-snacks">
                                <div className="snack1">
                                    <div className="cont-cookie-2">
                                        <img src={iconBurstPower} alt="poder burst" />
                                    </div>

                                    <div className="text-cookie">
                                        <p>Oro extra Nv. {burstPowerLevel}</p>
                                        <small className="text-info">Aumenta el oro extra del burst</small>
                                    </div>

                                    {burstPowerLevel >= 55 ? (
                                        <p className="snack-max-level">Nivel máximo</p>
                                    ) : (
                                        <div className="cont-unlock-btn">
                                            <button
                                                className={canAffordBurstPower ? 'notify-pulse' : ''}
                                                onClick={onUpgradeBurstPower}
                                                disabled={!canAffordBurstPower}
                                            >
                                                <img className="snack-btn-img" src={buttonImage} alt="Mejorar" />
                                            </button>
                                            <span className="snack-btn-price">
                                                {formatNumber(burstPowerCost)}
                                                <img src={iconGold} alt="gold" />
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
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


                    {/* ===== ORO OFFLINE ===== */}
                    {offlineGoldConfig && (
                        <div className="cont-snacks" data-tutorial="tut-snacks-modal">

                            {/* ORO OFFLINE */}
                            {offlineGoldConfig && (
                                <div className="container-snacks">
                                    <div className={`snack1 ${tutorialPhase === 'snacks' ? 'tutorial-pulse' : ''}`}>
                                        <div className="cont-cookie">
                                            <div className="cont-text-img">
                                                <img src={iconOffline} alt="oro-offline" />
                                            </div>
                                        </div>

                                        <div className='text-cookie'>
                                            <p>{offlineGoldLevel === -1 ? 'Oro Offline' : `Oro Offline Nv. ${offlineHoursLevel}`}</p>

                                            <small className='text-info'>Gana oro mientras no juegas</small>

                                        </div>

                                        {offlineGoldLevel === -1 ? (
                                            <div className="cont-unlock-btn">
                                                <button
                                                    className={canAffordOfflineGold ? "notify-pulse" : ""}
                                                    onClick={onUnlockOfflineGold}
                                                    disabled={!canAffordOfflineGold}
                                                    style={{ opacity: canAffordOfflineGold ? 1 : 0.5 }}
                                                >
                                                    <img src={iconUnlock} alt="desbloquear" style={{ width: 130, objectFit: 'contain' }} />
                                                </button>
                                                <span className="snack-btn-price ">{formatNumber(offlineGoldConfig[0].unlockCost)} <img src={iconGold} alt="gold" /></span>
                                            </div>
                                        ) : (
                                            <>
                                                {offlineHoursLevel < offlineHoursMax ? (
                                                    <div className="cont-unlock-btn">
                                                        <button
                                                            className={canAffordOfflineGold ? "notify-pulse" : ""}
                                                            onClick={onUpgradeOfflineGold}
                                                            disabled={!canAffordOfflineGold}
                                                            style={{ opacity: canAffordOfflineGold ? 1 : 0.5 }}
                                                        >
                                                            <img src={buttonImage} alt="Mejorar" style={{ width: 100, objectFit: 'contain' }} />
                                                        </button>
                                                        <span className="snack-btn-price ">{formatNumber(offlineHoursNextCost)} <img src={iconGold} alt="gold" /></span>
                                                    </div>
                                                ) : (
                                                    <p className="snack-max-level  ">Nivel máximo</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* RENDIMIENTO OFFLINE — sube rate2, solo visible tras desbloquear Oro Offline */}
                            {offlineGoldLevel >= 0 && (
                                <div className="container-snacks">
                                    <div className="snack1">
                                        <div className="cont-cookie">
                                            <div className="cont-text-img">
                                                <img src={iconOfflineRate2} alt="rendimiento-offline" />
                                            </div>
                                        </div>

                                        <div className='text-cookie'>
                                            <p>Rendimiento Offline Nv. {offlineRate2Level}</p>
                                            <small className='text-info'>Sube el oro offline pasada la ventana de horas</small>
                                        </div>

                                        {offlineRate2Level < offlineRate2Max ? (
                                            <div className="cont-unlock-btn">
                                                <button
                                                    className={canAffordOfflineRate2 ? "notify-pulse" : ""}
                                                    onClick={onUpgradeOfflineRate2}
                                                    disabled={!canAffordOfflineRate2}
                                                    style={{ opacity: canAffordOfflineRate2 ? 1 : 0.5 }}
                                                >
                                                    <img src={buttonImage} alt="Mejorar" style={{ width: 100, objectFit: 'contain' }} />
                                                </button>
                                                <span className="snack-btn-price ">{formatNumber(offlineRate2NextCost)} <img src={iconGold} alt="gold" /></span>
                                            </div>
                                        ) : (
                                            <p className="snack-max-level  ">Nivel máximo</p>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;