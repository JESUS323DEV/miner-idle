import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ForgeConfig } from '../../game/config/ForgeConfig';
import '../../styles/modals/ForgeModal.css';


//ASSETS FORJA LVL 1
import forgeBronze from "../../assets/ui/icons-forge/forges/forge-lvl1/forge-bronze.png"
import forgeIron from "../../assets/ui/icons-forge/forges/forge-lvl1/forge-iron.png"
import forgeDiamond from "../../assets/ui/icons-forge/forges/forge-lvl1/forge-diamond.png"

//ASSETS FORJA LVL 2
import forgeBronze2 from "../../assets/ui/icons-forge/forges/forge-lvl2/forge-bronze2.png"
import forgeIron2 from "../../assets/ui/icons-forge/forges/forge-lvl2/forge-iron2.png"
import forgeDiamond2 from "../../assets/ui/icons-forge/forges/forge-lvl2/forge-diamond2.png"

//ASSETS FORJA LVL 3
import forgeBronze3 from "../../assets/ui/icons-forge/forges/forge-lvl3/forge-bronze3.png"
import forgeIron3 from "../../assets/ui/icons-forge/forges/forge-lvl3/forge-iron3.png"
import forgeDiamond3 from "../../assets/ui/icons-forge/forges/forge-lvl3/forge-diamond3.png"



const MATERIALS = ['bronze', 'iron', 'diamond'];
const ICONS = { bronze: '🟫', iron: '⚙️', diamond: '💎' };
const NAMES = { bronze: 'Bronze', iron: 'Hierro', diamond: 'Diamante' };

const forgeAssets = {
    bronze: { 1: forgeBronze, 2: forgeBronze2, 3: forgeBronze3 },
    iron: { 1: forgeIron, 2: forgeIron2, 3: forgeIron3 },
    diamond: { 1: forgeDiamond, 2: forgeDiamond2, 3: forgeDiamond3 },
};

const ForgeModal = ({
    isOpen,
    onClose,
    gameState,
    onUnlockFurnace,
    onStartSmelt,
    onCollectIngot,
    onUpgradeFurnace,
}) => {
    const [timers, setTimers] = useState({ bronze: 0, iron: 0, diamond: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimers = {};
            MATERIALS.forEach(mat => {
                const furnace = gameState.furnaces[mat];
                if (furnace.isActive && furnace.startTime) {
                    const duration = ForgeConfig.furnaces[mat].levels[furnace.level] * 1000;
                    const elapsed = Date.now() - furnace.startTime;
                    const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
                    newTimers[mat] = remaining;

                    if (remaining === 0) {
                        onCollectIngot(mat);  // ← llama automáticamente
                    }
                } else {
                    newTimers[mat] = 0;
                }
            });
            setTimers(newTimers);
        }, 500);
        return () => clearInterval(interval);
    }, [gameState.furnaces]);

    if (!isOpen) return null;

    return (
        <div className="forge-overlay" onClick={onClose}>
            <div className="forge-content" onClick={e => e.stopPropagation()}>
                <button className="forge-close" onClick={onClose}><X /></button>
                <h2 className="forge-title">🔨 Forja</h2>

                <div className="forge-furnaces">
                    {MATERIALS.map(mat => {
                        const furnace = gameState.furnaces[mat];
                        const recipe = ForgeConfig.furnaces[mat].recipes;
                        const upgradeCost = ForgeConfig.furnaces[mat].upgradeCosts[furnace.level];
                        const duration = ForgeConfig.furnaces[mat].levels[furnace.level] * 1000;
                        const elapsed = furnace.startTime ? Date.now() - furnace.startTime : 0;
                        const progress = furnace.isActive ? Math.min(100, (elapsed / duration) * 100) : 0;
                        const isDone = furnace.isActive && timers[mat] === 0;
                        const hasEnough = gameState[recipe.input] >= recipe.inputAmount;
                        const showCollect = isDone && !hasEnough;

                        return (
                            <div key={mat} className={`forge-furnace ${!furnace.unlocked ? 'locked' : ''}`}>


                                <div className="forge-furnace-header">
                                    <span className="forge-furnace-icon">🏭</span>
                                    <span className="forge-furnace-name">{NAMES[mat]}</span>
                                    <span className="forge-furnace-level">Lvl {furnace.level}</span>
                                </div>

                                <div className="forge-furnace-info">
                                    <span>{ICONS[mat]} {gameState[recipe.input]} / {recipe.inputAmount}</span>
                                    <span>🔩 Lingotes: {gameState[ForgeConfig.furnaces[mat].recipes.output]}</span>
                                </div>

                                {!furnace.unlocked ? (
                                    <button
                                        className={`forge-btn-action locked ${gameState.gold < ForgeConfig.furnaces[mat].unlockCost ? 'disabled' : ''}`}
                                        onClick={() => onUnlockFurnace(mat)}
                                        disabled={gameState.gold < ForgeConfig.furnaces[mat].upgradeCost}
                                    >
                                        🔒 {ForgeConfig.furnaces[mat].unlockCost} oro
                                    </button>

                                ) : showCollect ? (
                                    <button className="forge-btn-action collect" onClick={() => onCollectIngot(mat)}>
                                        ✅ Recoger lingote
                                    </button>
                                ) : furnace.isActive ? (
                                    <div className="forge-progress-container">
                                        <div className="forge-progress-bar" style={{ width: `${progress}%` }} />
                                        <span className="forge-progress-text">{timers[mat]}s</span>
                                    </div>
                                ) : (
                                    <button
                                        className={`forge-btn-action ${!hasEnough ? 'disabled' : ''}`}
                                        onClick={() => onStartSmelt(mat)}
                                        disabled={!hasEnough}
                                    >
                                        🔥 Fundir
                                    </button>
                                )}

                                {furnace.unlocked && furnace.level < ForgeConfig.furnaces[mat].maxLevel && (
                                    <button
                                        className={`forge-btn-upgrade ${gameState.gold < 500 ? 'disabled' : ''}`}
                                        onClick={() => onUpgradeFurnace(mat)}
                                        disabled={gameState.gold < upgradeCost}
                                    >
                                        ⬆️ Mejorar Lvl {furnace.level + 1} ({upgradeCost} oro)
                                    </button>
                                )}


                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ForgeModal;