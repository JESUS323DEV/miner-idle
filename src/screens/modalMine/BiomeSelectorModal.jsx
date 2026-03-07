import { X } from "lucide-react";

import "../../styles/modals/BiomeSelectorModal.css"

const BiomeSelectorModal = ({
    isOpen,
    onClose,
    onSelectBiome,
    onUnlockBiome,
    currentGold,
    unlockedTypes,
    unlockedBiomes = [],
}) => {
    
    if (!isOpen) return null;

    const biomes = [
        { type: "bronze", name: "Mina de Bronce", unlockCost: 1000, color: "#CD7F32" },
        { type: "iron", name: "Mina de Hierro", unlockCost: 4000, color: "#808080" },
        { type: "diamond", name: "Mina de Diamante", unlockCost: 6000, color: "#B9F2FF" },
    ];

   const isBiomeUnlocked = (type) => unlockedBiomes.includes(type);

    return (
        <div className="biome-selector-overlay" onClick={onClose}>
            <div className="biome-selector-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}><X /></button>
                <h2>Selecciona Bioma</h2>

                <div className="biome-list">
                    {biomes.map(biome => {
                        const unlocked = isBiomeUnlocked(biome.type);
                        const canAfford = currentGold >= biome.unlockCost;

                        return (
                            <button
                                key={biome.type}
                                className={`biome-btn ${!unlocked && !canAfford ? "locked" : ""}`}
                                onClick={() => {
                                    if (unlocked) {
                                        onSelectBiome(biome.type);
                                        onClose();
                                    } else if (canAfford) {
                                        onUnlockBiome(biome.type);
                                        onSelectBiome(biome.type);
                                        onClose();
                                    }
                                }}
                                disabled={!unlocked && !canAfford}
                                style={{ borderColor: biome.color, background: biome.color }}
                            >
                                <p>{biome.name}</p>
                                {!unlocked && <span>🔒 {biome.unlockCost} oro</span>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default BiomeSelectorModal;