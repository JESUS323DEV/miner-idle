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
    tutorialHint = null,
    tutorialStep0Active = false,
    onShowGoldCost = null,
    materialIngotCost = null,
    tierIngotCost = null,
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
                        <img src={iconImage} loading="lazy" alt="Pickaxe" />
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
                                <img src={buttonImage} loading="lazy" alt="Upgrade" />
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
                                <img src={materialButtonImage} loading="lazy" alt="Upgrade Material" />
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
                        <p>Snack Durabilidad (Próximamente)</p>
                    </div>
                    <div className="snack2-repair">
                        <p>Snack Reparación (Próximamente)</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PickaxeModal;