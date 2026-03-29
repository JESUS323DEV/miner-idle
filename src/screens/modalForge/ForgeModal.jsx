import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ForgeConfig } from '../../game/config/ForgeConfig';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig';
import { useGameContext } from '../../game/context/GameContext.jsx';
import '../../styles/modals/ForgeModal.css';

import forgeIcon1 from "../../assets/ui/icons-pets/forge/forge-icon1.png";
import forgeIcon2 from "../../assets/ui/icons-pets/forge/forge-icon2.png";
import forgeIcon3 from "../../assets/ui/icons-pets/forge/forge-icon3.png";

const forgeDogAssets = {
    pip: forgeIcon1,   koda: forgeIcon2,  milo: forgeIcon3,
    rocky: forgeIcon1, bruno: forgeIcon2, max: forgeIcon3,
    rex: forgeIcon1,   toby: forgeIcon2,  buddy: forgeIcon3,
};


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

import buttonUpgrade from "../../assets/ui/icons-hud/hud-modals/buttonUpgrade.png"

import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.png"

import ingotBronze from "../../assets/ui/icons-forge/lingotes/lingote-bronze.png"
import ingotIron from "../../assets/ui/icons-forge/lingotes/lingote-iron.png"
import ingotDiamond from "../../assets/ui/icons-forge/lingotes/lingote-diamond.png"

import menaBronze from "../../assets/ui/icons-forge/menas-hud/bronzeHud.png"
import menaIron from "../../assets/ui/icons-forge/menas-hud/ironHud.png"
import menaDiamond from "../../assets/ui/icons-forge/menas-hud/diamondHud.png"

// Formatea números grandes (10k, 1.5M...)
const formatNumber = (num) => {
    if (num >= 1000000) return Number((num / 1000000).toFixed(1)) + 'M';
    if (num >= 1000) return Number((num / 1000).toFixed(1)) + 'k';
    return num;
};

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
        handleUnlockFurnace: onUnlockFurnace,
        handleStartSmelt: onStartSmelt,
        handleCollectIngot: onCollectIngot,
        handleUpgradeFurnace: onUpgradeFurnace,
        handleAssignForgeDog: onAssignForgeDog,
        handleUnassignForgeDog: onUnassignForgeDog,
    } = useGameContext();
    const forgeDogs = gameState.forgeDogs ?? {};

    const [timers, setTimers] = useState({ bronze: 0, iron: 0, diamond: 0 });
    const [dogMenuOpen, setDogMenuOpen] = useState(null);
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
                        const availableDogs = Object.values(forgeDogs).filter(
                            d => d && typeof d === 'object' && d.hired && d.assignedTo === null
                        );

                        const isMenuOpen = dogMenuOpen === mat;

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
                                                onClick={() => setDogMenuOpen(isMenuOpen ? null : mat)}
                                            >
                                                {assignedDog ? (
                                                    <>
                                                        <img src={forgeDogAssets[assignedDog.id]} className="forge-dog-slot-img" alt={assignedDog.id} />
                                                        <button className="forge-dog-slot-unassign" onClick={e => { e.stopPropagation(); onUnassignForgeDog(assignedDog.id); }}>✖</button>
                                                    </>
                                                ) : (
                                                    <span className="forge-dog-slot-plus">+</span>
                                                )}
                                            </div>
                                            {assignedDog && (
                                                <span className="forge-dog-slot-name">{ForgeDogsConfig[assignedDog.id].name}</span>
                                            )}

                                            {isMenuOpen && (
                                                <div className="forge-dog-menu">
                                                    {availableDogs.length === 0
                                                        ? <span className="forge-dog-menu-empty">Sin mascotas libres</span>
                                                        : availableDogs.map(d => (
                                                            <button key={d.id} className="forge-dog-menu-option" onClick={e => { e.stopPropagation(); onAssignForgeDog(d.id, mat); setDogMenuOpen(null); }}>
                                                                <img src={forgeDogAssets[d.id]} className="forge-dog-menu-img" alt={d.id} />
                                                                {ForgeDogsConfig[d.id].name}
                                                            </button>
                                                        ))
                                                    }
                                                    <button className="forge-dog-menu-cancel" onClick={e => { e.stopPropagation(); setDogMenuOpen(null); }}>✕</button>
                                                </div>
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
            </div>
        </div>
    );
};

export default ForgeModal;