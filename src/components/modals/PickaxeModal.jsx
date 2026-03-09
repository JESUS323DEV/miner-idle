import { X } from "lucide-react";
import '../../styles/modals/PickaxeModal.css';

// ===== ASSETS: LINGOTES =====
import lingoteBronze from "../../assets/ui/icons-forge/lingotes/lingote-bronze.png"
import lingoteIron from "../../assets/ui/icons-forge/lingotes/lingote-iron.png"
import lingoteDiamond from "../../assets/ui/icons-forge/lingotes/lingote-diamond.png"

// ===== ASSETS: ORO =====
import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.png"

/**
 * Formatea números grandes para mostrarlos más legibles
 * 1000 → 1k | 1000000 → 1M
 */
const formatNumber = (num) => {
    if (num >= 1000000) return Number((num / 1000000).toFixed(1)) + 'M';
    if (num >= 1000) return Number((num / 1000).toFixed(1)) + 'k';
    return num;
};

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
    showRefill,
    refillCost,
    onRefill,
    canAffordRefill,
    bgImage,
    iconImage,
    buttonImage,
    refillButtonImage,
    pickaxeTier,
    pickaxeMaterial,
    onUpgradeMaterial,
    materialCost,
    canAffordMaterial,
    materialButtonImage,
    tutorialMessage = null,
    onShowGoldCost = null,
    materialIngotCost = null,
    tierIngotCost = null,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-pickaxe" onClick={onClose}>
            <div
                className="pickaxe-modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="pickaxe-modal">

                    {/* BOTÓN CERRAR */}
                    <button className="modal-close" onClick={onClose}><X /></button>

                    {/* MENSAJE TUTORIAL */}
                    {tutorialMessage && (
                        <div className='title-modal-pickaxe'>
                            <p>{tutorialMessage}</p>
                        </div>
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
                                className={`btn-upgrade ${!canAfford ? "locked" : ""}`}
                                onClick={() => { onShowGoldCost?.(cost); onUpgrade(); }}
                                disabled={!canAfford}
                            >
                                <img src={buttonImage} loading="lazy" alt="Upgrade" />
                                <span className="info-tier">
                                    {formatNumber(cost)}<img src={iconGold} alt="Gold" />
                                    {tierIngotCost && (
                                        <>
                                            {' + '}{tierIngotCost.amount}
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
                                            {' + '}{materialIngotCost.amount}
                                            <img src={getLingoteIcon(materialIngotCost.type)} alt="lingote" />
                                        </>
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PickaxeModal;