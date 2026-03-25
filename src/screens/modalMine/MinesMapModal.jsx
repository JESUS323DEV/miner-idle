import { useState, useEffect, useRef } from 'react';
import '../../styles/modals/MinesMapModal.css';
import MinesConfig from '../../game/config/MinesConfig.js';
import { useGameContext } from '../../game/context/GameContext.jsx';
import { DogsConfig } from '../../game/config/DogsConfig.js';



//ASSETS MENA BRONZE (1=rota, 2=dañada, 3=entera)
import menaBronze1 from "../../assets/ui/icons-menas/menas-bronze/mena-bronze1.png"
import menaBronze2 from "../../assets/ui/icons-menas/menas-bronze/mena-bronze2.png"
import menaBronze3 from "../../assets/ui/icons-menas/menas-bronze/mena-bronze3.png"
//ASSETS MENA IRON
import menaIron1 from "../../assets/ui/icons-menas/menas-iron/mena-iron1.png"
import menaIron2 from "../../assets/ui/icons-menas/menas-iron/mena-iron2.png"
import menaIron3 from "../../assets/ui/icons-menas/menas-iron/mena-iron3.png"
//ASSETS MENA DIAMOND
import menaDiamond1 from "../../assets/ui/icons-menas/menas-diamond/mena-diamond1.png"
import menaDiamond2 from "../../assets/ui/icons-menas/menas-diamond/mena-diamond2.png"
import menaDiamond3 from "../../assets/ui/icons-menas/menas-diamond/mena-diamond3.png"

import ladyIcon   from "../../assets/ui/icons-pets/mineros/lady-icon.png"
import tokyoIcon  from "../../assets/ui/icons-pets/mineros/tokyo-icon.png"
import tukaIcon   from "../../assets/ui/icons-pets/mineros/tuka-icon.png"
import munaIcon   from "../../assets/ui/icons-pets/mineros/muna-icon.png"
import gordoIcon  from "../../assets/ui/icons-pets/mineros/gordo-icon.png"
import druhIcon   from "../../assets/ui/icons-pets/mineros/druh-icon.png"
import smokeIcon  from "../../assets/ui/icons-pets/mineros/smoke-icon.png"
import nupitoIcon from "../../assets/ui/icons-pets/mineros/nupito-icon.png"
import zeusIcon   from "../../assets/ui/icons-pets/mineros/zeus-icon.png"
const dogAssets = {
    lady: ladyIcon, tokio: tokyoIcon, tuka: tukaIcon,
    muna: munaIcon, gordo: gordoIcon, druh: druhIcon,
    smoke: smokeIcon, nupito: nupitoIcon, zeus: zeusIcon,
};

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
        handleDogMineYacimiento: onDogMineYacimiento,
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

    //ASSETS MENAS DENTRO DE MINAS — cambia según durabilidad
    const getMenaAsset = (durability, maxDurability, type) => {
        const assets = {
            bronze: [menaBronze1, menaBronze2, menaBronze3],
            iron: [menaIron1, menaIron2, menaIron3],
            diamond: [menaDiamond1, menaDiamond2, menaDiamond3],
        };
        const pct = durability / maxDurability;
        const index = pct > 0.6 ? 2 : pct > 0.2 ? 1 : 0;
        return assets[type]?.[index] || null;
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
                                                    src={getMenaAsset(1, 1, selectedBiome)}
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

                                        </div>

                                    );

                                    return (
                                        <YacimientoSlotActivo
                                            key={slot.id}
                                            slot={slot}
                                            mena={mena}
                                            ready={ready}
                                            timeLeft={timeLeft}
                                            config={config}
                                            selectedBiome={selectedBiome}
                                            dogAssigned={getDogAssigned(slot.id)}
                                            dogMenuOpen={dogMenuSlot === slot.id}
                                            availableDogs={getAvailableDogs()}
                                            getMenaAsset={getMenaAsset}
                                            biomeHudAssets={biomeHudAssets}
                                            formatNumber2={formatNumber2}
                                            isRepairing={isRepairing}
                                            getRepairTimeLeft={getRepairTimeLeft}
                                            iconGold={iconGold}
                                            onMine={onMineYacimiento}
                                            onDogMine={onDogMineYacimiento}
                                            onRepair={onRepairYacimiento}
                                            onAssignDog={onAssignDog}
                                            onUnassignDog={onUnassignDog}
                                            onToggleDogMenu={() => setDogMenuSlot(dogMenuSlot === slot.id ? null : slot.id)}
                                        />
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


const YacimientoSlotActivo = ({
    slot, mena, ready, timeLeft, config, selectedBiome,
    dogAssigned, dogMenuOpen, availableDogs,
    getMenaAsset, biomeHudAssets, formatNumber2, isRepairing, getRepairTimeLeft, iconGold,
    onMine, onDogMine, onRepair, onAssignDog, onUnassignDog, onToggleDogMenu,
}) => {
    const [isShaking, setIsShaking] = useState(false);
    const [floatingNumbers, setFloatingNumbers] = useState([]);
    const [slotFlipped, setSlotFlipped] = useState(false);
    const intervalRef = useRef(null);

    const triggerHit = (amount, x, y) => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 150);

        const id = Date.now() + Math.random();
        setFloatingNumbers(prev => [...prev, { id, amount, x, y }]);
        setTimeout(() => setFloatingNumbers(prev => prev.filter(n => n.id !== id)), 900);
    };

    const handleClick = (e) => {
        if (!ready || isRepairing(mena) || mena.durability <= 0) return;
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        onMine(slot.id, selectedBiome, (amount) => {
            triggerHit(amount, e.clientX - rect.left, e.clientY - rect.top);
        });
    };

    // Auto-click del perro (solo animación — el estado lo maneja useDogsAutomine)
    useEffect(() => {
        if (!dogAssigned || !ready || isRepairing(mena) || mena.durability <= 0) {
            clearInterval(intervalRef.current);
            return;
        }
        const dogCfg = DogsConfig[dogAssigned.id];
        const speed = (dogCfg?.miningSpeed ?? 2) * 1000;
        const amount = Math.floor((dogCfg?.miningPower ?? 1) * (dogCfg?.biomeBonus?.[selectedBiome] ?? 1));

        intervalRef.current = setInterval(() => {
            const x = 50 + Math.random() * 40;
            const y = 40 + Math.random() * 30;

            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 150);

            const id = Date.now() + Math.random();
            setFloatingNumbers(prev => [...prev, { id, amount, x, y }]);
            setTimeout(() => setFloatingNumbers(prev => prev.filter(n => n.id !== id)), 900);
        }, speed);
        return () => clearInterval(intervalRef.current);
    }, [dogAssigned, ready, mena.durability, mena.repairingUntil]); // eslint-disable-line

    return (
        <div className="yacimiento-slot active">
            <div className="mena-click-area" onClick={handleClick}>
                <div className="mena-durability-label">{mena.durability}/{mena.maxDurability}</div>
                <div key={mena.durability / mena.maxDurability > 0.6 ? 2 : mena.durability / mena.maxDurability > 0.2 ? 1 : 0} className="mena-swap-wrapper">
                    <img
                        src={getMenaAsset(mena.durability, mena.maxDurability, selectedBiome)}
                        alt={selectedBiome}
                        className={`mena-img ${isShaking ? 'mena-shake' : ''} ${ready && !isRepairing(mena) && mena.durability > 0 ? 'mena-clickable' : 'mena-disabled'}`}
                    />
                </div>
                {floatingNumbers.map(n => (
                    <div key={n.id} className="mena-floating" style={{ left: n.x, top: n.y }}>
                        +{n.amount} <img src={biomeHudAssets[selectedBiome]} alt={selectedBiome} className="mena-floating-icon" />
                    </div>
                ))}
            </div>

            <div className="mena-bottom">
                <div className="mena-bottom-info">
                    {!ready && <span>⏱️ {timeLeft}s</span>}
                    {isRepairing(mena)
                        ? <span>🪏 {getRepairTimeLeft(mena)}s</span>
                        : <span
                            className={`repair-mena-btn ${mena.durability >= mena.maxDurability ? 'repair-disabled' : ''} ${mena.durability <= 0 ? 'repair-urgent' : ''}`}
                            onClick={(e) => {
                                if (mena.durability < mena.maxDurability) {
                                    e.stopPropagation();
                                    onRepair(slot.id, selectedBiome);
                                }
                            }}
                        >
                            🪏
                            <span className="info-yacimientos">
                                <img className="icon-info" src={iconGold} alt="gold" /> {formatNumber2(config?.repairCost)}
                            </span>
                        </span>
                    }
                </div>

            </div>
            <div
                className={`dog-slot-box${dogAssigned ? ` dog-rarity-${DogsConfig[dogAssigned.id]?.rarity}` : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (dogAssigned) { setSlotFlipped(f => !f); }
                    onToggleDogMenu();
                }}
            >
                <div className={`dog-slot-flip${slotFlipped && dogAssigned ? ' flipped' : ''}`}>
                    {/* FRENTE: portrait */}
                    <div className="dog-slot-front">
                        {dogAssigned ? (
                            <>
                                {dogAssets[dogAssigned.id]
                                    ? <img src={dogAssets[dogAssigned.id]} className="dog-slot-img" alt={dogAssigned.id} />
                                    : <span className="dog-slot-emoji">🐕</span>
                                }
                                <button className="dog-slot-unassign"
                                    onClick={(e) => { e.stopPropagation(); setSlotFlipped(false); onUnassignDog(dogAssigned.id); }}
                                >✖</button>
                            </>
                        ) : (
                            <>
                                <span className="dog-slot-hint">🐕</span>
                                <span className="dog-slot-plus">+</span>
                            </>
                        )}
                    </div>
                    {/* REVERSO: stats de mina */}
                    {dogAssigned && (() => {
                        const cfg = DogsConfig[dogAssigned.id];
                        const bonus = cfg?.biomeBonus?.[selectedBiome] ?? 1;
                        return (
                            <div className="dog-slot-back">
                                <span>⛏ poder {cfg?.miningPower}</span>
                                <span>1 pic/{cfg?.miningSpeed}s</span>
                                {bonus !== 1 && <span className="dsb-bonus">x{bonus} aquí</span>}
                            </div>
                        );
                    })()}
                </div>

                {/* Menú asignar / cambiar */}
                {dogMenuOpen && (
                    <div className="dog-menu">
                        {availableDogs.length === 0
                            ? <span className="dog-menu-empty">Sin mascotas libres</span>
                            : availableDogs.map(dog => (
                                <button key={dog.id} className="dog-menu-option"
                                    onClick={(e) => { e.stopPropagation(); onAssignDog(dog.id, selectedBiome, slot.id); onToggleDogMenu(); }}
                                >🐕 {DogsConfig[dog.id]?.name ?? dog.id}</button>
                            ))
                        }
                        <button className="dog-menu-cancel"
                            onClick={(e) => { e.stopPropagation(); onToggleDogMenu(); }}
                        >Cancelar</button>
                    </div>
                )}
            </div>

            <span className="dog-slot-label">
                {dogAssigned ? (DogsConfig[dogAssigned.id]?.name ?? dogAssigned.id) : 'mascota'}
            </span>
        </div>
    );
};

export default MinesMapModal;