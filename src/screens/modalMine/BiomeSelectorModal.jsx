import { X } from "lucide-react";

import "../../styles/modals/BiomeSelectorModal.css"
import { useGameContext } from "../../game/context/GameContext.jsx";

const fmt = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'k';
    return num;
};

const BiomeSelectorModal = ({ isOpen, onClose, onSelectBiome }) => {
    const { gameState, handleUnlockMineType: onUnlockBiome, showGoldCost: onShowGoldCost } = useGameContext();
    const { gold: currentGold, mines } = gameState;
    const { unlockedBiomes = [] } = mines;

    if (!isOpen) return null;

    const biomes = [
        { type: "bronze", name: "Bronce",   emoji: "🏜️", unlockCost: 1000,  color: "#CD7F32", glow: "rgba(205,127,50,0.5)" },
        { type: "iron",   name: "Hierro",   emoji: "🏔️", unlockCost: 10000, color: "#9E9E9E", glow: "rgba(158,158,158,0.5)" },
        { type: "diamond",name: "Diamante", emoji: "❄️", unlockCost: 50000, color: "#89DFFF", glow: "rgba(137,223,255,0.5)" },
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
                        const isLocked = !unlocked && !canAfford;

                        return (
                            <button
                                key={biome.type}
                                className={`biome-btn ${unlocked ? "biome-unlocked" : canAfford ? "biome-affordable" : "biome-locked"}`}
                                onClick={() => {
                                    if (unlocked) {
                                        onSelectBiome(biome.type);
                                        onClose();
                                    } else if (canAfford) {
                                        onShowGoldCost(biome.unlockCost);
                                        onUnlockBiome(biome.type);
                                        onSelectBiome(biome.type);
                                        onClose();
                                    }
                                }}
                                disabled={isLocked}
                                style={{ "--biome-color": biome.color, "--biome-glow": biome.glow }}
                            >
                                <span className="biome-emoji">{biome.emoji}</span>
                                <div className="biome-info">
                                    <span className="biome-name">{biome.name}</span>
                                    {!unlocked && (
                                        <span className="biome-cost">
                                            {isLocked ? "🔒" : "🔓"} {fmt(biome.unlockCost)} 🪙
                                        </span>
                                    )}
                                    {unlocked && <span className="biome-ready">Disponible</span>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default BiomeSelectorModal;