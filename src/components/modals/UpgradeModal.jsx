import '../../styles/modals/UpgradeModal.css';
import { X } from "lucide-react";

import coinTavern from "../../assets/ui/icons-hud/hud-principal/coin-tavern1.png"
import iconCookie from "../../assets/ui/icons-hud/hud-modals/cookie.png"

/**
 * COMPONENTE: UpgradeModal
 * 
 * Modal reutilizable para todos los upgrades del juego:
 * - Oro por segundo (upgrade simple)
 * - Stamina máxima (upgrade + botón de recargar)
 * - Pico (upgrade de tier O cambio de material + botón de reparar)
 * 
 * El modal cambia su comportamiento según las props que recibe.
 */
const UpgradeModal = ({
    // ===== PROPS BÁSICAS (usadas por todos los modales) =====
    isOpen,              // Boolean: Si el modal está abierto
    onClose,             // Function: Cierra el modal
    title,               // String: Título del modal (ej: "Mejorar oro por segundo")
    currentLevel,        // String: Nivel actual (ej: "x4", "lvl 10", "Tier 2")
    cost,                // Number: Coste del upgrade principal
    onUpgrade,           // Function: Ejecuta el upgrade principal
    canAfford,           // Boolean: Si puede pagar el upgrade

    // ===== PROPS PARA BOTÓN DE REFILL/REPAIR (stamina y pico) =====
    showRefill,          // Boolean: Si muestra botón de recargar/reparar
    refillCost,          // String: Texto del coste (ej: "Recargar: 60 Oro")
    onRefill,            // Function: Ejecuta la recarga/reparación
    canAffordRefill,     // Boolean: Si puede pagar la recarga

    tutorialStep0Active = false,
    tutorialMessage = null,  // ✅ NUEVO

    // ===== PROPS PARA IMÁGENES PERSONALIZADAS =====
    bgImage,             // String: Fondo del modal
    iconImage,           // String: Icono del upgrade (oro, stamina, pico)
    buttonImage,         // String: Imagen del botón principal
    refillButtonImage,   // String: Imagen del botón de refill

    // ===== PROPS ESPECÍFICAS DEL PICO =====
    isPickaxe,           // Boolean: Si es el modal del pico (activa lógica especial)
    pickaxeTier,         // Number: Tier actual del pico (0, 1, 2, 3)
    pickaxeMaterial,     // String: Material actual ("stone", "bronze", "metal", "diamond")
    onUpgradeMaterial,   // Function: Cambia el material del pico
    materialCost,        // Number: Coste en oro del cambio de material
    canAffordMaterial,   // Boolean: Si puede pagar oro + material requerido
    materialButtonImage, // String: Imagen del botón de upgrade de material

    showSnacks = false,           // ✅ NUEVO
    snacksData = null,            // ✅ NUEVO
    tavernCoins = 0,              // ✅ NUEVO
    onUnlockSnack = null,         // ✅ NUEVO
    onUpgradeSnack = null,        // ✅ NUEVO
    onUseSnack = null             // ✅ NUEVO
}) => {
    // Si el modal no está abierto, no renderiza nada
    if (!isOpen) return null;

    /**
     * HELPER: getNextMaterial
     * Devuelve el nombre del siguiente material según el actual
     * @param {String} current - Material actual ("stone", "bronze", "metal")
     * @returns {String} - Nombre del siguiente material en español
     */
    const getNextMaterial = (current) => {
        const materials = {
            stone: "Bronze",    // Stone → Bronze
            bronze: "Metal",    // Bronze → Metal/Iron
            metal: "Diamante"   // Metal → Diamond
        };
        return materials[current] || "???";
    };

    /**
     * HELPER: getMaterialCost
     * Devuelve el tipo y cantidad de material necesario para el upgrade
     * @param {String} material - Material actual del pico
     * @returns {Object|null} - {type: "Bronce", amount: 50} o null si no hay siguiente
     */
    const getMaterialCost = (material) => {
        if (material === "stone") return { amount: 5, type: "Lingotes Bronze" };
        if (material === "bronze") return { amount: 3, type: "Lingotes Hierro" };
        if (material === "metal") return { amount: 2, type: "Lingotes Diamante" };
        return null;
    };

    return (
        // OVERLAY OSCURO (clickear fuera cierra el modal)
        <div className="modal-overlay" onClick={tutorialStep0Active ? undefined : onClose}>
            {/* CONTENEDOR DEL MODAL (stopPropagation evita que se cierre al clickear dentro) */}
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundImage: `url(${bgImage})` }}>

                <div className='modal'>
                    {/* BOTÓN DE CERRAR (X) - Oculto en tutorial paso 0 */}
                    {(!tutorialStep0Active) && (
                        <button className="modal-close" onClick={onClose}>
                            <X />
                        </button>
                    )}

                    {/* TÍTULO DEL MODAL - MENSAJE TUTORIAL */}
                    {tutorialMessage && (
                        <div className='title-modal'>
                            <p >
                                {tutorialMessage}
                            </p>
                        </div>
                    )}

                    {/* SECCIÓN PRINCIPAL: Icono + Nivel + Botón de Upgrade */}
                    <div className="modal-info">
                        {/* ICONO Y NIVEL ACTUAL */}
                        <div className='gold-info'>
                            <img src={iconImage} loading='lazy' alt="icon" />
                            <p>{currentLevel}</p>
                        </div>

                        {/* LÓGICA CONDICIONAL: Pico tiene 2 tipos de botones según tier */}
                        {isPickaxe ? (
                            <>
                                {/* Si tier < 3 → Botón de subir tier (solo oro) */}
                                {pickaxeTier < 3 ? (
                                    <button
                                        className={`btn-upgrade ${!canAfford ? "locked" : ""}`}
                                        onClick={onUpgrade}
                                        disabled={!canAfford}
                                    >
                                        <img src={buttonImage} loading='lazy' alt="Upgrade" />
                                        <p>Coste: {cost} Oro</p>
                                    </button>
                                ) : (
                                    /* Si tier === 3 → Botón de cambiar material (oro + material) */
                                    <button
                                        className={`btn-upgrade-material ${!canAffordMaterial ? "locked" : ""}`}
                                        onClick={onUpgradeMaterial}
                                        disabled={!canAffordMaterial}
                                    >
                                        <img src={materialButtonImage} loading='lazy' alt="Upgrade Material" />
                                        <p>Upgrade a {getNextMaterial(pickaxeMaterial)}</p>
                                        <p>Coste: {materialCost} Oro + {getMaterialCost(pickaxeMaterial)?.amount} {getMaterialCost(pickaxeMaterial)?.type}</p>
                                    </button>
                                )}
                            </>
                        ) : (
                            /* Oro/Stamina → Botón normal (solo oro) */
                            <button
                                className={`btn-upgrade ${!canAfford ? "locked" : ""}`}
                                onClick={onUpgrade}
                                disabled={!canAfford}
                            >
                                <img src={buttonImage} loading='lazy' alt="Upgrade" />
                                <p>Coste: {cost} Oro</p>
                            </button>
                        )}
                    </div>

                    {/* BOTÓN DE REFILL/REPAIR (solo aparece si showRefill === true) */}
                    {/* Stamina → Botón de recargar | Pico → Botón de reparar */}
                    {showRefill && (
                        <button
                            className={`refill-btn-modal ${!canAffordRefill ? "locked" : ""}`}
                            onClick={onRefill}
                            disabled={!canAffordRefill}
                        >
                            <img src={refillButtonImage} loading='lazy' alt="Recargar" />
                            <p>{refillCost} Oro</p>
                        </button>
                    )}


                    {/* ========== SNACKS (solo si showSnacks = true) ========== */}
                    {showSnacks && snacksData && (
                        <div className='cont-snacks' >

                            <h3>
                                SNACKS (Monedas: {tavernCoins} 🪙)
                            </h3>

                            {/* GALLETA */}
                            <div className='container-snacks'>
                                <div className='snack1'>

                                    <div className='cont-cookie'>
                                        <div className='cont-text-img'>
                                            <img src={iconCookie} alt="icon-Cookie" />
                                            <p>Galleta</p>
                                        </div>


                                    </div>



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
                                                {
                                                    snacksData.cookie.active !== null
                                                        ? "⌛"

                                                        : (
                                                            <>
                                                                <span>
                                                                    X1
                                                                    <img src={coinTavern} alt="usar snack" />
                                                                </span>
                                                            </>
                                                        )
                                                }
                                            </button>

                                            {snacksData.cookie.level < 3 && (
                                                <button
                                                    onClick={() => onUpgradeSnack('cookie')}
                                                    disabled={tavernCoins < (snacksData.cookie.level === 1 ? 10 : 15)}
                                                    style={{
                                                        opacity: tavernCoins < (snacksData.cookie.level === 1 ? 10 : 15) ? 0.5 : 1,
                                                    }} >

                                                    Mejorar a Lvl {snacksData.cookie.level + 1} ({snacksData.cookie.level === 1 ? 10 : 15} 🪙)
                                                </button>
                                            )}


                                        </>
                                    )}
                                </div>

                                {/* BEBIDA (placeholder) */}
                                <div className='snack2' >
                                    <p>🥤 Bebida (Próximamente)</p>
                                </div>

                                {/* PASTEL (placeholder)
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