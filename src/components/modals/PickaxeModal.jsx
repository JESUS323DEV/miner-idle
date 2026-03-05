import { X } from "lucide-react";
import '../../styles/modals/PickaxeModal.css';

const getNextMaterial = (current) => {
    const materials = { stone: "Bronze", bronze: "Metal", metal: "Diamante" };
    return materials[current] || "???";
};

const getMaterialCost = (material) => {
    if (material === "stone") return { amount: 5, type: "Lingotes Bronze" };
    if (material === "bronze") return { amount: 3, type: "Lingotes Hierro" };
    if (material === "metal") return { amount: 2, type: "Lingotes Diamante" };
    return null;
};

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
                    <button className="modal-close" onClick={onClose}><X /></button>

                    <div className="pickaxe-modal-info">
                        <img src={iconImage} loading="lazy" alt="Pickaxe" />
                        <p>{currentLevel}</p>
                    </div>

                    {pickaxeTier < 3 ? (
                        <button
                            className={`btn-upgrade ${!canAfford ? "locked" : ""}`}
                            onClick={onUpgrade}
                            disabled={!canAfford}
                        >
                            <img src={buttonImage} loading="lazy" alt="Upgrade" />
                            <p>Coste: {cost} Oro</p>
                        </button>
                    ) : (
                        <button
                            className={`btn-upgrade-material ${!canAffordMaterial ? "locked" : ""}`}
                            onClick={onUpgradeMaterial}
                            disabled={!canAffordMaterial}
                        >
                            <img src={materialButtonImage} loading="lazy" alt="Upgrade Material" />
                            <p>Upgrade a {getNextMaterial(pickaxeMaterial)}</p>
                            <p>Coste: {materialCost} Oro + {getMaterialCost(pickaxeMaterial)?.amount} {getMaterialCost(pickaxeMaterial)?.type}</p>
                        </button>
                    )}


                </div>
            </div>
        </div>
    );
};

export default PickaxeModal;