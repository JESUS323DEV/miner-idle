import { useState } from 'react';
import '../../styles/modals/MinesMapModal.css';
import MinesConfig from '../../game/config/MinesConfig.js';
import { useGameContext } from '../../game/context/GameContext.jsx';



//ASSETS MENA BRONZE

import menaBronze1 from "../../assets/ui/icons-menas/menas-bronze/mena-bronze2.png"
import menaBronze2 from "../../assets/ui/icons-menas/menas-bronze/mena-bronze3.png"
//ASSETS MENA IRON
import menaIron1 from "../../assets/ui/icons-menas/menas-iron/mena-iron2.png"
import menaIron2 from "../../assets/ui/icons-menas/menas-iron/mena-iron3.png"

//ASSETS MENA DIAMOND
import menaDiamond1 from "../../assets/ui/icons-menas/menas-diamond/mena-diamond2.png"
import menaDiamond2 from "../../assets/ui/icons-menas/menas-diamond/mena-diamond3.png"

import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.png"

import bronzeHud from "../../assets/ui/icons-forge/menas-hud/bronzeHud.png"
import ironHud from "../../assets/ui/icons-forge/menas-hud/ironHud.png"
import diamondHud from "../../assets/ui/icons-forge/menas-hud/diamondHud.png"



import { X } from 'lucide-react';

const MinesMapModal = ({ isOpen, onClose, selectedBiome = null, bgImage = null, onEnterMine }) => {
    const {
        gameState,
        handleUnlockMineType: onUnlockType,
        handlePlantMena: onPlantMena,
        handleMineYacimiento: onMineYacimiento,
        handleRepairYacimiento: onRepairYacimiento,
        handleUnlockYacimientoSlot: onUnlockYacimientoSlot,
        handleAssignDog: onAssignDog,
        handleUnassignDog: onUnassignDog,
    } = useGameContext();
    const { gold: currentGold, mines, yacimientos, dogs = {} } = gameState;
    const { unlockedTypes, bestScores } = mines;
    const minesConfig = MinesConfig;

    // ⚠️ useState SIEMPRE antes del early return (Rules of Hooks)
    const [dogMenuSlot, setDogMenuSlot] = useState(null); // slotId abierto

    if (!isOpen) return null;

    // Perro asignado a este slot
    const getDogAssigned = (slotId) => {
        return Object.values(dogs).find(
            d => d && typeof d === 'object' && d.assignedTo?.biome === selectedBiome && d.assignedTo?.slotId === slotId
        ) || null;
    };

    // Perros contratados y libres
    const getAvailableDogs = () => {
        return Object.values(dogs).filter(
            d => d && typeof d === 'object' && d.hired && d.assignedTo === null && dogs.goldDog !== d.id
        );
    };

    // Formatea números grandes (1k, 1.5M...) PARA INFO DEL HUD - MENAS LINGOTES
    const formatNumber2 = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'k';
        return num;
    };

    //ASSETS MENAS DENTRO DE MINAS
    const getMenaAsset = (slotId, type) => {
        const assets = {
            bronze: [menaBronze1, menaBronze2],
            iron: [menaIron1, menaIron2],
            diamond: [menaDiamond1, menaDiamond2],
        };
        return assets[type]?.[slotId - 1] || null;
    };

    //ASSETS ICON MENAS INFO
    const biomeHudAssets = {
        bronze: bronzeHud,
        iron: ironHud,
        diamond: diamondHud,
    };

    const filteredUnlocked = unlockedTypes
        .filter(type => type !== 'gold')
        .filter(type => selectedBiome ? type === selectedBiome || type.startsWith(selectedBiome) : true);

    const filteredLocked = Object.keys(minesConfig)
        .filter(type => type !== 'gold' && !unlockedTypes.includes(type))
        .filter(type => selectedBiome ? type === selectedBiome || type.startsWith(selectedBiome) : true);

    const canAffordUnlock = (unlockCost) => currentGold >= unlockCost;
    const canAffordEnter = () => true;

    // Comprueba si la mena ya está lista para picar
    const isMenaReady = (mena) => {
        if (!mena) return false;
        if (mena.ready) return true;
        return Date.now() - mena.plantedAt >= mena.growthTime * 1000;
    };

    const isRepairing = (mena) => {
        if (!mena || !mena.repairingUntil) return false;
        return Date.now() < mena.repairingUntil;
    };

    const getRepairTimeLeft = (mena) => {
        if (!mena || !mena.repairingUntil) return 0;
        return Math.ceil((mena.repairingUntil - Date.now()) / 1000);
    };

    // Tiempo restante para que la mena esté lista
    const getGrowthTimeLeft = (mena) => {
        if (!mena || isMenaReady(mena)) return 0;
        const elapsed = (Date.now() - mena.plantedAt) / 1000;
        return Math.ceil(mena.growthTime - elapsed);
    };

    return (
        <div className="modal-overlay1" >
            <div className="mines-modal-content" onClick={(e) => e.stopPropagation()}
                style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }}
            >
                {/* HEADER */}
                <div className="mines-modal-header">
                    <button className="modal-close" onClick={onClose}><X /></button>
                </div>

                {/* CONTENIDO */}
                <div className="mines-content">

                    {/* MINAS DESBLOQUEADAS */}
                    {filteredUnlocked.length > 0 && filteredUnlocked.map(type => {
                        const config = minesConfig[type];
                        if (!config) return null;
                        const baseMineType = type.replace('_lvl2', '').replace('_lvl3', '');
                        const level = type.includes('_lvl3') ? 'lvl3' : type.includes('_lvl2') ? 'lvl2' : 'lvl1';
                        const canEnter = canAffordEnter();

                        return (
                            <div key={type} className={`mine-card mine-card-${baseMineType} mine-card-${level}`}>
                                <button
                                    className="btn-enter-mine"
                                    onClick={() => canEnter && onEnterMine(type)}
                                >
                                    Entrar
                                </button>
                            </div>
                        );
                    })}

                    {/* MINAS BLOQUEADAS */}
                    {filteredLocked.map(type => {
                        const config = minesConfig[type];
                        const canAfford = canAffordUnlock(config.unlockCost);
                        const meetsStarRequirement = config.requiresStars
                            ? (bestScores?.[config.requiresStars.mineType] ?? 0) >= config.requiresStars.stars
                            : true;
                        const canUnlock = canAfford && meetsStarRequirement;
                        const baseMineType = type.replace('_lvl2', '').replace('_lvl3', '');
                        const level = type.includes('_lvl3') ? 'lvl3' : type.includes('_lvl2') ? 'lvl2' : 'lvl1';

                        return (
                            <div key={type} className={`mine-card locked mine-card-${baseMineType} mine-card-${level}`}>
                                {config.requiresStars && !meetsStarRequirement && (
                                    <span className="mine-star-req">
                                        {config.requiresStars.stars}⭐ {config.requiresStars.mineType}
                                    </span>
                                )}
                                <button
                                    className={`btn-unlock-mine ${!canUnlock ? 'disabled' : ''}`}
                                    onClick={() => { if (canUnlock) onUnlockType(type); }}
                                    disabled={!canUnlock}
                                >
                                    <img src={iconGold} alt="gold" className="btn-cost-icon" />
                                    {formatNumber2(config.unlockCost)}
                                    🔒
                                </button>
                            </div>
                        );
                    })}

                    {/* YACIMIENTOS */}
                    {yacimientos && selectedBiome && (
                        <div className="yacimientos-section">
                            <div className="yacimientos-slots">
                                {yacimientos[selectedBiome].slots.map(slot => {
                                    const mena = slot.mena;
                                    const ready = isMenaReady(mena);
                                    const timeLeft = getGrowthTimeLeft(mena);
                                    const config = mena ? yacimientos[selectedBiome].slotConfig[slot.id] : null;

                                    const unlockCost = yacimientos[selectedBiome].unlockCosts[slot.id];

                                    if (!slot.unlocked) return (
                                        <div key={slot.id} className="yacimiento-slot locked">
                                            <div className="mena-locked-container">
                                                <img
                                                    src={getMenaAsset(slot.id, selectedBiome)}
                                                    alt="locked"
                                                    className="mena-img mena-no-durability"
                                                />
                                                <span
                                                    className="mena-lock-icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onUnlockYacimientoSlot(slot.id, selectedBiome);
                                                    }}
                                                >
                                                    🔒
                                                </span>
                                            </div>

                                            <div className='yacimiento-info'>

                                                <span className="mena-unlock-cost">
                                                    {formatNumber2(unlockCost.gold)}
                                                    <img src={iconGold} alt="iconGold" />
                                                </span>

                                                <span className='mena-unlock-cost'>
                                                    {formatNumber2(unlockCost.amount)}
                                                    <img src={biomeHudAssets[selectedBiome]} alt={selectedBiome} />
                                                </span>


                                            </div>

                                        </div>
                                    );

                                    if (!mena) return (
                                        <div key={slot.id} className="yacimiento-slot empty">
                                            <p>🪏</p>
                                            <div className="mena-bottom">
                                                <button
                                                    className="btn-plant-mena"
                                                    onClick={(e) => { e.stopPropagation(); onPlantMena(slot.id, selectedBiome); }}
                                                >
                                                    Excavar
                                                </button>
                                            </div>
                                            <div
                                                className="dog-slot-box"
                                                onClick={(e) => { e.stopPropagation(); setDogMenuSlot(dogMenuSlot === slot.id ? null : slot.id); }}
                                            >
                                                {getDogAssigned(slot.id) ? (
                                                    <>
                                                        <span className="dog-slot-emoji">🐕</span>
                                                        <button
                                                            className="dog-slot-unassign"
                                                            onClick={(e) => { e.stopPropagation(); onUnassignDog(getDogAssigned(slot.id).id); }}
                                                        >✖</button>
                                                    </>
                                                ) : (
                                                    <span className="dog-slot-plus">+</span>
                                                )}
                                                {dogMenuSlot === slot.id && (
                                                    <div className="dog-menu">
                                                        {getAvailableDogs().length === 0
                                                            ? <span className="dog-menu-empty">Sin mascotas libres</span>
                                                            : getAvailableDogs().map(dog => (
                                                                <button key={dog.id} className="dog-menu-option"
                                                                    onClick={(e) => { e.stopPropagation(); onAssignDog(dog.id, selectedBiome, slot.id); setDogMenuSlot(null); }}
                                                                >🐕 {dog.id}</button>
                                                            ))
                                                        }
                                                        <button className="dog-menu-cancel"
                                                            onClick={(e) => { e.stopPropagation(); setDogMenuSlot(null); }}
                                                        >Cancelar</button>
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    );



                                    return (
                                        <div key={slot.id} className="yacimiento-slot active">
                                            <span className="mena-durability">
                                                <small>{mena.durability}/{mena.maxDurability}</small>
                                                <img src={biomeHudAssets[selectedBiome]} alt={selectedBiome} />
                                            </span>
                                            <img
                                                src={getMenaAsset(slot.id, selectedBiome)}
                                                alt={selectedBiome}
                                                className={`mena-img ${ready && !isRepairing(mena) ? 'mena-clickable' : 'mena-disabled'}`}
                                                onClick={(e) => {
                                                    if (ready && !isRepairing(mena)) {
                                                        e.stopPropagation();
                                                        onMineYacimiento(slot.id, selectedBiome);
                                                    }
                                                }}
                                            />
                                            <div className="mena-bottom">
                                                <div className="mena-bottom-info">
                                                    {!ready && <span>⏱️ {timeLeft}s</span>}
                                                    {isRepairing(mena)
                                                        ? <span>🪏 {getRepairTimeLeft(mena)}s</span>
                                                        : <span
                                                            className={`repair-mena-btn ${mena.durability >= mena.maxDurability ? 'repair-disabled' : ''}`}
                                                            onClick={(e) => {
                                                                if (mena.durability < mena.maxDurability) {
                                                                    e.stopPropagation();
                                                                    onRepairYacimiento(slot.id, selectedBiome);
                                                                }
                                                            }}
                                                        >
                                                            🪏
                                                            <span className='info-yacimientos'>
                                                                <img className='icon-info' src={iconGold} alt="icon-gold" /> {formatNumber2(config?.repairCost)}
                                                            </span>
                                                        </span>
                                                    }
                                                </div>

                                            </div>

                                            {/*==================SLOT MASCOTA/AYUDANTE===========================f*/}

                                            <div
                                                className="dog-slot-box"
                                                onClick={(e) => { e.stopPropagation(); setDogMenuSlot(dogMenuSlot === slot.id ? null : slot.id); }}
                                            >
                                                {getDogAssigned(slot.id) ? (
                                                    <>
                                                        <span className="dog-slot-emoji">🐕</span>
                                                        <button
                                                            className="dog-slot-unassign"
                                                            onClick={(e) => { e.stopPropagation(); onUnassignDog(getDogAssigned(slot.id).id); }}
                                                        >✖</button>
                                                    </>
                                                ) : (
                                                    <span className="dog-slot-plus">+</span>
                                                )}
                                                {dogMenuSlot === slot.id && (
                                                    <div className="dog-menu">
                                                        {getAvailableDogs().length === 0
                                                            ? <span className="dog-menu-empty">Sin mascotas libres</span>
                                                            : getAvailableDogs().map(dog => (
                                                                <button key={dog.id} className="dog-menu-option"
                                                                    onClick={(e) => { e.stopPropagation(); onAssignDog(dog.id, selectedBiome, slot.id); setDogMenuSlot(null); }}
                                                                >🐕 {dog.id}</button>
                                                            ))
                                                        }
                                                        <button className="dog-menu-cancel"
                                                            onClick={(e) => { e.stopPropagation(); setDogMenuSlot(null); }}
                                                        >Cancelar</button>
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default MinesMapModal;