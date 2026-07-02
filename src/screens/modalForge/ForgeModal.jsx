import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ForgeConfig } from '../../game/config/ForgeConfig';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig';
import { useGameContext } from '../../game/context/GameContext.jsx';
import ForgeDogModal from './ForgeDogModal';
import '../../styles/modals/ForgeModal.css';

import forgeIcon1 from "../../assets/ui/icons-pets/forge/forge-icon1.webp";
import forgeIcon2 from "../../assets/ui/icons-pets/forge/forge-icon2.webp";
import forgeIcon3 from "../../assets/ui/icons-pets/forge/forge-icon3.webp";
import forgeIcon4 from "../../assets/ui/icons-pets/forge/forge-icon4.webp";
import forgeIcon5 from "../../assets/ui/icons-pets/forge/forge-icon5.webp";
import forgeIcon6 from "../../assets/ui/icons-pets/forge/forge-icon6.webp";
import forgeIcon7 from "../../assets/ui/icons-pets/forge/forge-icon7.webp";
import forgeIcon8 from "../../assets/ui/icons-pets/forge/forge-icon8.webp";
import forgeIcon9 from "../../assets/ui/icons-pets/forge/forge-icon9.webp";

const forgeDogAssets = {
    pip: forgeIcon1, koda: forgeIcon2, milo: forgeIcon3,
    rocky: forgeIcon4, bruno: forgeIcon5, max: forgeIcon6,
    rex: forgeIcon7, toby: forgeIcon8, buddy: forgeIcon9,
};


//ASSETS FORJA LVL 1
import forgeBronze from "../../assets/ui/icons-forge/forges/forge-lvl1/forge-bronze.webp"
import forgeIron from "../../assets/ui/icons-forge/forges/forge-lvl1/forge-iron.webp"
import forgeDiamond from "../../assets/ui/icons-forge/forges/forge-lvl1/forge-diamond.webp"

//ASSETS FORJA LVL 2
import forgeBronze2 from "../../assets/ui/icons-forge/forges/forge-lvl2/forge-bronze2.webp"
import forgeIron2 from "../../assets/ui/icons-forge/forges/forge-lvl2/forge-iron2.webp"
import forgeDiamond2 from "../../assets/ui/icons-forge/forges/forge-lvl2/forge-diamond2.webp"

//ASSETS FORJA LVL 3
import forgeBronze3 from "../../assets/ui/icons-forge/forges/forge-lvl3/forge-bronze3.webp"
import forgeIron3 from "../../assets/ui/icons-forge/forges/forge-lvl3/forge-iron3.webp"
import forgeDiamond3 from "../../assets/ui/icons-forge/forges/forge-lvl3/forge-diamond3.webp"

import buttonUpgrade from "../../assets/ui/icons-hud/hud-modals/buttonUpgrade.webp"

import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.webp"

import ingotBronze from "../../assets/ui/icons-forge/lingotes/lingote-bronze.webp"
import ingotIron from "../../assets/ui/icons-forge/lingotes/lingote-iron.webp"
import ingotDiamond from "../../assets/ui/icons-forge/lingotes/lingote-diamond.webp"

import menaBronze from "../../assets/ui/icons-forge/menas-hud/bronzeHud.webp"
import menaIron from "../../assets/ui/icons-forge/menas-hud/ironHud.webp"
import menaDiamond from "../../assets/ui/icons-forge/menas-hud/diamondHud.webp"

import { formatNumber } from '../../game/utils/formatters.js';

const MATERIALS = ['bronze', 'iron', 'diamond'];
const ICONS = { bronze: '🟫', iron: '⚙️', diamond: '💎' };
const NAMES = { bronze: 'Bronze', iron: 'Hierro', diamond: 'Diamante' };

//mapeo assets iconos - info- hud 
const ingotAssets = {
    bronze: ingotBronze,
    iron: ingotIron,
    diamond: ingotDiamond,
};

const menaAssets = {
    bronze: menaBronze,
    iron: menaIron,
    diamond: menaDiamond,
};

//mapeo assets forjas
const forgeAssets = {
    bronze: { 1: forgeBronze, 2: forgeBronze2, 3: forgeBronze3 },
    iron: { 1: forgeIron, 2: forgeIron2, 3: forgeIron3 },
    diamond: { 1: forgeDiamond, 2: forgeDiamond2, 3: forgeDiamond3 },
};

const ForgeModal = ({ isOpen, onClose }) => {
    const {
        gameState,
        setGameState,
        handleUnlockFurnace: onUnlockFurnace,
        handleStartSmelt: onStartSmelt,
        handleCollectIngot: onCollectIngot,
        handleUpgradeFurnace: onUpgradeFurnace,
        handleAssignForgeDog: onAssignForgeDog,
        handleUnassignForgeDog: onUnassignForgeDog,
    } = useGameContext();
    const forgeDogs = gameState.forgeDogs ?? {};
    const passiveRaids = gameState.raid?.passiveRaids ?? [];

    const [showIntro, setShowIntro] = useState(false);
    const [timers, setTimers] = useState({ bronze: 0, iron: 0, diamond: 0 });
    const [dogModalTarget, setDogModalTarget] = useState(null);

    const handleForgeAssign = (dogId) => {
        const currentEntry = Object.entries(forgeDogs).find(([, d]) => d?.assignedTo === dogModalTarget);
        if (currentEntry && currentEntry[0] !== dogId) {
            onUnassignForgeDog(currentEntry[0]);
        }
        if (!currentEntry || currentEntry[0] !== dogId) {
            onAssignForgeDog(dogId, dogModalTarget);
        }
    };

    useEffect(() => {
        if (isOpen && !gameState.tutorial?.forgeIntroDone) {
            setShowIntro(true);
        }
    }, [isOpen]);
    useEffect(() => {
        const interval = setInterval(() => {
            const newTimers = {};
            MATERIALS.forEach(mat => {
                const furnace = gameState.furnaces[mat];
                if (furnace.isActive && furnace.startTime) {
                    const duration = (furnace.currentDuration ?? ForgeConfig.furnaces[mat].levels[furnace.level]) * 1000;
                    const elapsed = Date.now() - furnace.startTime;
                    const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
                    newTimers[mat] = remaining;

                    if (remaining === 0) {
                        onCollectIngot(mat);
                    }
                } else {
                    newTimers[mat] = 0;
                }
            });
            setTimers(newTimers);
        }, 500);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        const duration = (furnace.currentDuration ?? ForgeConfig.furnaces[mat].levels[furnace.level]) * 1000;
                        const elapsed = furnace.startTime ? Date.now() - furnace.startTime : 0;
                        const progress = furnace.isActive ? Math.min(100, (elapsed / duration) * 100) : 0;
                        const hasEnough = gameState[recipe.input] >= recipe.inputAmount;
                        const stock = gameState[recipe.input] ?? 0;

                        const assignedDog = Object.values(forgeDogs).find(
                            d => d && typeof d === 'object' && d.hired && d.assignedTo === mat
                        );

                        return (
                            <div key={mat} className={`forge-furnace forge-furnace-${mat} ${!furnace.unlocked ? 'locked' : ''}`}>

                                {/* IZQUIERDA: imagen + nombre + slot perro */}
                                <div className="forge-furnace-header">
                                    <span className="forge-furnace-icon">
                                        <img src={forgeAssets[mat][furnace.level]} alt={mat} className={`forge-furnace-img ${furnace.isActive ? 'forge-furnace-img-active' : ''}`} />
                                    </span>
                                    <span className="forge-furnace-name">
                                        {NAMES[mat]} <small>Lvl {furnace.level}</small>
                                    </span>

                                    {furnace.unlocked && (
                                        <div className="forge-dog-slot-wrap">
                                            <div
                                                className={`forge-dog-slot${assignedDog ? ` dog-rarity-${ForgeDogsConfig[assignedDog.id].rarity}` : ''}`}
                                                onClick={() => setDogModalTarget(mat)}
                                            >
                                                {assignedDog ? (
                                                    <img src={forgeDogAssets[assignedDog.id]} className="forge-dog-slot-img" alt={assignedDog.id} />
                                                ) : (
                                                    <span className="forge-dog-slot-plus">+</span>
                                                )}
                                            </div>
                                            {assignedDog && (
                                                <span className="forge-dog-slot-name">{ForgeDogsConfig[assignedDog.id].name}</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* DERECHA: receta + botones */}
                                <div className="cont-btn-action">
                                    <div className="forge-recipe">
                                        <span className={`forge-recipe-stock ${hasEnough ? 'stock-ok' : 'stock-low'}`}>
                                            ({formatNumber(stock)})
                                        </span>
                                        <img src={menaAssets[mat]} alt={mat} className="forge-recipe-icon" />
                                        <span>{recipe.inputAmount}</span>
                                        <span>→</span>
                                        <img src={ingotAssets[mat]} alt={mat} className="forge-recipe-icon" />
                                        <span>1</span>
                                    </div>

                                    {!furnace.unlocked ? (
                                        <button
                                            className={`forge-btn-action locked ${gameState.gold < ForgeConfig.furnaces[mat].unlockCost ? 'disabled' : ''}`}
                                            onClick={() => onUnlockFurnace(mat)}
                                            disabled={gameState.gold < ForgeConfig.furnaces[mat].unlockCost}
                                        >
                                            <span className="icon-info-gold">
                                                🔒 {formatNumber(ForgeConfig.furnaces[mat].unlockCost)}
                                                <img src={iconGold} loading="lazy" alt="Oro" />
                                            </span>
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
                                            className={`forge-btn-upgrade ${gameState.gold < upgradeCost ? 'disabled' : ''}`}
                                            onClick={() => onUpgradeFurnace(mat)}
                                            disabled={gameState.gold < upgradeCost}
                                        >
                                            <span className="icon-upgrade">
                                                <img src={buttonUpgrade} alt="Upgrade" />
                                                <span className="icon-info-gold">
                                                    <small>{formatNumber(upgradeCost)}</small>
                                                    <img src={iconGold} loading="lazy" alt="oro" />
                                                </span>
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <ForgeDogModal
                    isOpen={dogModalTarget !== null}
                    onClose={() => setDogModalTarget(null)}
                    targetMaterial={dogModalTarget}
                    setTarget={setDogModalTarget}
                    forgeDogs={forgeDogs}
                    onAssign={handleForgeAssign}
                    onUnassign={onUnassignForgeDog}
                    passiveRaids={passiveRaids}
                />

                {showIntro && (
                    <div className="forge-intro-overlay">
                        <h3 className="forge-intro-title">La Forja</h3>
                        <p className="forge-intro-text">
                            Convierte minerales en valiosos lingotes y desbloquea nuevos hornos para procesar materiales más raros. Los lingotes son esenciales para mejorar tu pico, conseguir monedas en la taberna y avanzar hacia tiers superiores. Más adelante podrás asignar mascotas a los hornos para aumentar la velocidad de producción.
                        </p>
                        <button
                            className="forge-intro-btn"
                            onClick={() => {
                                setShowIntro(false);
                                setGameState(prev => ({
                                    ...prev,
                                    tutorial: { ...prev.tutorial, forgeIntroDone: true }
                                }));
                            }}
                        >
                            Entendido
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgeModal;