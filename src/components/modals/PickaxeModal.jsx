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
 * Se usa para mostrar el icono del lingote en el coste de upgrade de material
 */
const lingoteIcons = {
    "Lingotes Bronze": lingoteBronze,
    "Lingotes Hierro": lingoteIron,
    "Lingotes Diamante": lingoteDiamond,
};

/**
 * Devuelve el nombre en español del material actual del pico
 * stone → Piedra | bronze → Bronze | metal → Metal | diamond → Diamante
 */
const getMaterialName = (material) => {
    const names = { stone: "Piedra", bronze: "Bronze", metal: "Metal", diamond: "Diamante" };
    return names[material] || material;
};

/**
 * Devuelve el nombre del siguiente material al que se puede mejorar
 * stone → Bronze | bronze → Metal | metal → Diamante
 */
const getNextMaterial = (current) => {
    const materials = { stone: "Bronze", bronze: "Metal", metal: "Diamante" };
    return materials[current] || "???";
};

/**
 * Devuelve la cantidad y tipo de lingotes necesarios para mejorar el material del pico
 * stone → 5 Lingotes Bronze
 * bronze → 3 Lingotes Hierro
 * metal → 2 Lingotes Diamante
 */
const getMaterialCost = (material) => {
    if (material === "stone") return { amount: 5, type: "Lingotes Bronze" };
    if (material === "bronze") return { amount: 3, type: "Lingotes Hierro" };
    if (material === "metal") return { amount: 2, type: "Lingotes Diamante" };
    return null;
};

/**
 * COMPONENTE: PickaxeModal
 * Modal de mejora del pico — gestiona dos tipos de upgrade:
 * 1. Tier (0→1→2→3): mejora dentro del mismo material, cuesta oro
 * 2. Material (stone→bronze→metal→diamond): requiere tier 3 + lingotes + oro
 */
const PickaxeModal = ({
    isOpen,             // Si el modal está abierto
    onClose,            // Función para cerrarlo
    currentLevel,       // Tier actual del pico (ej: "Tier 2")
    cost,               // Coste en oro de subir tier
    onUpgrade,          // Función que ejecuta el upgrade de tier
    canAfford,          // Si tiene oro suficiente para el tier upgrade
    showRefill,         // (legacy) Si mostrar botón de recarga
    refillCost,         // (legacy) Coste de recarga
    onRefill,           // (legacy) Función de recarga
    canAffordRefill,    // (legacy) Si puede pagar recarga
    bgImage,            // Imagen de fondo del modal
    iconImage,          // Imagen del pico actual
    buttonImage,        // Imagen del botón de tier upgrade
    refillButtonImage,  // (legacy) Imagen del botón de recarga
    pickaxeTier,        // Tier actual (0-3)
    pickaxeMaterial,    // Material actual (stone/bronze/metal/diamond)
    onUpgradeMaterial,  // Función que ejecuta el upgrade de material
    materialCost,       // Coste en oro del upgrade de material
    canAffordMaterial,  // Si tiene oro Y lingotes suficientes para el material upgrade
    materialButtonImage,// Imagen del botón de material upgrade
    tutorialMessage = null,     // Mensaje del tutorial con puntero animado
    onShowGoldCost = null,      // Función para mostrar número flotante de gasto
    tierIngotCost = null,
}) => {
    // No renderiza si el modal está cerrado
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-pickaxe" onClick={onClose}>
            <div
                className="pickaxe-modal-content"
                onClick={(e) => e.stopPropagation()} // Evita cerrar al clickar dentro
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="pickaxe-modal">

                    {/* BOTÓN CERRAR */}
                    <button className="modal-close" onClick={onClose}><X /></button>

                    {/* MENSAJE TUTORIAL — solo visible durante el tutorial paso 2 */}
                    {tutorialMessage && (
                        <div className='title-modal-pickaxe'>
                            <p>{tutorialMessage}</p>
                        </div>
                    )}

                    {/* INFO PICO — nombre del material + tier + imagen del pico */}
                    <div className="pickaxe-modal-info">
                        <p>Pico {getMaterialName(pickaxeMaterial)} {currentLevel}</p>
                        <img src={iconImage} loading="lazy" alt="Pickaxe" />
                    </div>

                    {/* ZONA DE UPGRADE */}
                    <div className="cont-upgrade-pickaxe">

                        {/* TIER < 3: muestra botón de subir tier con coste en oro */}
                        {pickaxeTier < 3 ? (
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
                                            <img src={lingoteIcons[tierIngotCost.type === 'bronzeIngot' ? 'Lingotes Bronze' : tierIngotCost.type === 'ironIngot' ? 'Lingotes Hierro' : 'Lingotes Diamante']} alt="lingote" />
                                        </>
                                    )}
                                </span>
                            </button>
                        ) : (
                            /* TIER = 3: muestra botón de cambiar material (requiere lingotes) */
                            <button
                                className={`btn-upgrade-material ${!canAffordMaterial ? "locked" : ""}`}
                                onClick={() => { onShowGoldCost?.(materialCost); onUpgradeMaterial(); }}
                                disabled={!canAffordMaterial}
                            >
                                <img src={materialButtonImage} loading="lazy" alt="Upgrade Material" />
                            </button>
                        )}

                        {/* INFO UPGRADE MATERIAL — solo visible en tier 3
                            Muestra el nombre del siguiente material y el coste completo (oro + lingotes) */}
                        {pickaxeTier >= 3 && (
                            <div className="info-upgrade-pickaxe">
                                <p>Pico {getNextMaterial(pickaxeMaterial)}</p>
                                <span>
                                    Coste: {formatNumber(materialCost)} <img src={iconGold} alt="oro" />
                                    {' + '}
                                    {getMaterialCost(pickaxeMaterial)?.amount}
                                    <img src={lingoteIcons[getMaterialCost(pickaxeMaterial)?.type]} alt="lingote" />
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