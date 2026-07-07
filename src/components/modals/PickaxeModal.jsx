import { X } from "lucide-react";
import '../../styles/modals/PickaxeModal.css';
import '../../styles/modals/UpgradeModal.css';

// ===== ASSETS: LINGOTES =====
import lingoteBronze from "../../assets/ui/icons-forge/lingotes/lingote-bronze.webp"
import lingoteIron from "../../assets/ui/icons-forge/lingotes/lingote-iron.webp"
import lingoteDiamond from "../../assets/ui/icons-forge/lingotes/lingote-diamond.webp"

// ===== ASSETS: ORO =====
import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.webp"

import { formatNumber } from '../../game/utils/formatters.js';

/**
 * Mapea el tipo de lingote a su imagen correspondiente
 */
const lingoteIcons = {
    "Lingotes Bronze": lingoteBronze,
    "Lingotes Hierro": lingoteIron,
    "Lingotes Diamante": lingoteDiamond,
};

/** Convierte tipo interno a nombre de display */
const getLingoteIcon = (type) => {
    if (type === 'bronzeIngot') return lingoteIcons["Lingotes Bronze"];
    if (type === 'ironIngot') return lingoteIcons["Lingotes Hierro"];
    if (type === 'diamondIngot') return lingoteIcons["Lingotes Diamante"];
    return null;
};

/**
 * Devuelve el nombre en español del material actual del pico
 */
const getMaterialName = (material) => {
    const names = { stone: "Piedra", bronze: "Bronze", metal: "Metal", diamond: "Diamante" };
    return names[material] || material;
};

/**
 * Devuelve el nombre del siguiente material al que se puede mejorar
 */
const getNextMaterial = (current) => {
    const materials = { stone: "Bronze", bronze: "Metal", metal: "Diamante" };
    return materials[current] || "???";
};

/**
 * COMPONENTE: PickaxeModal
 */
const PickaxeModal = ({
    isOpen,
    onClose,
    currentLevel,
    cost,
    onUpgrade,
    canAfford,
    bgImage,
    iconImage,
    buttonImage,
    pickaxeTier,
    pickaxeMaterial,
    onUpgradeMaterial,
    materialCost,
    canAffordMaterial,
    materialButtonImage,
    tutorialPhase = null,
    tutorialStep0Active = false,
    onShowGoldCost = null,
    materialIngotCost = null,
    tierIngotCost = null,
    onAutomineUpgrade = null,
    automineLevel = 0,
    automineMax = 4,
    automineNextCost = null,
    canAffordAutomineUpgrade = false,
    automineUnlocked = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-pickaxe" onClick={tutorialStep0Active ? undefined : onClose}>
            <div
                className="pickaxe-modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="pickaxe-modal">

                    {/* BOTÓN CERRAR — oculto durante tutorial */}
                    {!tutorialStep0Active && (
                        <button className="modal-close" onClick={onClose}><X /></button>
                    )}



                    {/* INFO PICO */}
                    <div className="pickaxe-modal-info">
                        <p>Pico {getMaterialName(pickaxeMaterial)} {currentLevel}</p>
                        <img src={iconImage} alt="Pickaxe" />
                    </div>

                    {/* ZONA DE UPGRADE */}
                    <div className="cont-upgrade-pickaxe">

                        {pickaxeTier < 5 ? (
                            <button
                                className={`btn-upgrade ${!canAfford ? "locked" : ""} ${tutorialPhase === 'upgrade' ? "tutorial-pulse" : ""}`}
                                onClick={() => { onShowGoldCost?.(cost); onUpgrade(); }}
                                disabled={!canAfford}
                                data-tutorial="tut-pickaxe-modal"
                            >
                                <img src={buttonImage} alt="Upgrade" />
                                <span className="info-tier">
                                    {formatNumber(cost)}<img src={iconGold} alt="Gold" />
                                    {tierIngotCost && (
                                        <>
                                            {tierIngotCost.amount}
                                            <img src={getLingoteIcon(tierIngotCost.type)} alt="lingote" />
                                        </>
                                    )}
                                </span>

                            </button>
                        ) : (
                            <button
                                className={`btn-upgrade-material ${!canAffordMaterial ? "locked" : ""}`}
                                onClick={() => { onShowGoldCost?.(materialCost); onUpgradeMaterial(); }}
                                disabled={!canAffordMaterial}
                            >
                                <img src={materialButtonImage} alt="Upgrade Material" />
                            </button>
                        )}

                        {/* INFO UPGRADE MATERIAL — solo tier 3 */}
                        {pickaxeTier >= 5 && (
                            <div className="info-upgrade-pickaxe">
                                <p>Pico {getNextMaterial(pickaxeMaterial)}</p>
                                <span>
                                    Coste: {formatNumber(materialCost)} <img src={iconGold} alt="oro" />
                                    {materialIngotCost && (
                                        <>
                                            {materialIngotCost.amount}
                                            <img src={getLingoteIcon(materialIngotCost.type)} alt="lingote" />
                                        </>
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                </div>


                <div className="cont-snack-stamina">
                    <div className="snack1-stamina">
                        {!automineUnlocked ? (
                            <div className="slot-upgrade-content">
                                <p className="slot-upgrade-title">Recarga Autominar</p>
                                <small className="slot-soon-tag">Desbloquea autominar</small>
                            </div>
                        ) : automineLevel >= automineMax ? (
                            <div className="slot-upgrade-content">
                                <p className="slot-upgrade-title">Recarga Autominar</p>
                                <small className="slot-soon-tag">Al maximo</small>
                            </div>
                        ) : (
                            <div className="slot-upgrade-content">
                                <div>

                                    <p className="slot-upgrade-title">Recarga Autominar</p>
                                    <span className="slot-upgrade-lvl">Nv {automineLevel}</span>
                                </div>

                                <button
                                    className={`btn-slot-upgrade${!canAffordAutomineUpgrade ? ' locked' : ''}`}
                                    onClick={onAutomineUpgrade}
                                    disabled={!canAffordAutomineUpgrade}
                                >
                                    Mejorar
                                    <span className="info-tier">
                                        {formatNumber(automineNextCost)}<img src={iconGold} alt="Gold" />
                                    </span>

                                </button>
                            </div>
                        )}
                    </div>
                    <div className="snack2-repair">
                        <span className="slot-soon-name">Snack Reparacion</span>
                        <span className="slot-soon-tag">Proximamente</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PickaxeModal;