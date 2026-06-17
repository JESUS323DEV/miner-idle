import { useState, useEffect, useRef } from 'react';
import '../../styles/modals/MinesMapModal.css';
import '../../styles/modals/MineScreen.css';
import MinesConfig from '../../game/config/MinesConfig.js';
import { useGameContext } from '../../game/context/GameContext.jsx';
import { DogsConfig } from '../../game/config/DogsConfig.js';
import { SESSION_DURATION } from '../../game/initialState/InitialYacimientosState.js';

const BIOME_INTRO = {
    bronze:  { title: "Mina de Bronce",   text: "Explora minas de extracción para conseguir materiales con tu pico y desbloquea puestos mineros donde tus mascotas trabajarán por ti incluso cuando no estés minando. Después, convierte las menas en valiosos lingotes en la forja para mejorar tu equipo y seguir avanzando." },
    iron:    { title: "Mina de Hierro",   text: "El hierro es más resistente y valioso que el bronce. Necesitarás un pico más potente para extraerlo, pero sus materiales te permitirán acceder a mejoras más avanzadas, forjar un pico de mayor calidad y continuar tu camino hacia recursos aún más raros." },
    diamond: { title: "Mina de Diamante", text: "El diamante es uno de los materiales más raros y valiosos que existen. Sus vetas son escasas y duran muy pocos golpes, así que aprovecha cada oportunidad para extraerlo. Utilízalo con sabiduría para fabricar el mejor equipo y alcanzar los tiers más altos." },
};

const INTRO_FLAG = {
    bronze:  'mineIntroBronzeDone',
    iron:    'mineIntroIronDone',
    diamond: 'mineIntroDiamondDone',
};

import menaBronze3   from "../../assets/ui/icons-menas/menas-bronze/mena-bronze3.png"
import menaIron3     from "../../assets/ui/icons-menas/menas-iron/mena-iron3.png"
import menaDiamond3  from "../../assets/ui/icons-menas/menas-diamond/mena-diamond3.png"
const menaIntactAssets = { bronze: menaBronze3, iron: menaIron3, diamond: menaDiamond3 };

import ladyIcon   from "../../assets/ui/icons-pets/mineros/lady-icon.png"
import tokyoIcon  from "../../assets/ui/icons-pets/mineros/tokyo-icon.png"
import tukaIcon   from "../../assets/ui/icons-pets/mineros/tuka-icon.png"
import munaIcon   from "../../assets/ui/icons-pets/mineros/muna-icon.png"
import gordoIcon  from "../../assets/ui/icons-pets/mineros/gordo-icon.png"
import druhIcon   from "../../assets/ui/icons-pets/mineros/druh-icon.png"
import smokeIcon  from "../../assets/ui/icons-pets/mineros/smoke-icon.png"
import nupitoIcon from "../../assets/ui/icons-pets/mineros/nupito-icon.png"
import zeusIcon      from "../../assets/ui/icons-pets/mineros/zeus-icon.png"
import boxerIcon     from "../../assets/ui/icons-pets/mineros/boxer-icon.png"
import bullyIcon     from "../../assets/ui/icons-pets/mineros/bully-icon.png"
import chihuahuaIcon from "../../assets/ui/icons-pets/mineros/chihuhua-icon.png"
const dogAssets = {
    lady: ladyIcon, tokio: tokyoIcon, tuka: tukaIcon,
    muna: munaIcon, gordo: gordoIcon, druh: druhIcon,
    smoke: smokeIcon, nupito: nupitoIcon, zeus: zeusIcon,
    boxer: boxerIcon, bully: bullyIcon, chihuahua: chihuahuaIcon,
};

import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.png"
import iconCoin from "../../assets/ui/icons-hud/hud-principal/coin-tavern1.png"

import bronzeHud from "../../assets/ui/icons-forge/menas-hud/bronzeHud.png"
import ironHud from "../../assets/ui/icons-forge/menas-hud/ironHud.png"
import diamondHud from "../../assets/ui/icons-forge/menas-hud/diamondHud.png"

import { X } from 'lucide-react';

const biomeHudAssets = {
    bronze: bronzeHud,
    iron: ironHud,
    diamond: diamondHud,
};

const MinesMapModal = ({ isOpen, onClose, selectedBiome = null, bgImage = null, onEnterMine, set1Complete = true }) => {
    const {
        gameState,
        setGameState,
        handleUnlockMineType: onUnlockType,
        handleUnlockYacimientoSlot: onUnlockYacimientoSlot,
        handleActivateYacimiento: onActivateYacimiento,
        handleAssignDog: onAssignDog,
        handleUnassignDog: onUnassignDog,
    } = useGameContext();
    const { gold: currentGold, tavernCoins, mines, yacimientos, dogs = {} } = gameState;
    const { unlockedTypes, bestScores } = mines;
    const minesConfig = MinesConfig;

    const [showIntro, setShowIntro] = useState(false);
    const [dogMenuSlot, setDogMenuSlot] = useState(null);

    useEffect(() => {
        if (!isOpen || !selectedBiome) return;
        const flag = INTRO_FLAG[selectedBiome];
        if (flag && !gameState.tutorial?.[flag]) {
            setShowIntro(true);
        }
    }, [isOpen, selectedBiome]); // eslint-disable-line

    if (!isOpen) return null;

    const getDogAssigned = (slotId) => {
        return Object.values(dogs).find(
            d => d && typeof d === 'object' && d.assignedTo?.biome === selectedBiome && d.assignedTo?.slotId === slotId
        ) || null;
    };

    const getAvailableDogs = () => {
        return Object.values(dogs).filter(
            d => d && typeof d === 'object' && d.hired && d.assignedTo === null
        );
    };

    const formatNumber2 = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'k';
        return num;
    };

    const filteredUnlocked = unlockedTypes
        .filter(type => type !== 'gold')
        .filter(type => selectedBiome ? type === selectedBiome || type.startsWith(selectedBiome) : true);

    const filteredLocked = Object.keys(minesConfig)
        .filter(type => type !== 'gold' && !unlockedTypes.includes(type))
        .filter(type => selectedBiome ? type === selectedBiome || type.startsWith(selectedBiome) : true);

    const canAffordUnlock = (unlockCost) => currentGold >= unlockCost;

    return (
        <div className="modal-overlay1" >
            <div className="mines-modal-content" onClick={(e) => e.stopPropagation()}
                style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }}
            >
                {showIntro && BIOME_INTRO[selectedBiome] && (
                    <div className="mine-intro-overlay">
                        <h3 className="mine-intro-title">{BIOME_INTRO[selectedBiome].title}</h3>
                        <p className="mine-intro-text">{BIOME_INTRO[selectedBiome].text}</p>
                        <button
                            className="mine-intro-btn"
                            onClick={() => {
                                setShowIntro(false);
                                setGameState(prev => ({
                                    ...prev,
                                    tutorial: { ...prev.tutorial, [INTRO_FLAG[selectedBiome]]: true }
                                }));
                            }}
                        >
                            Entendido
                        </button>
                    </div>
                )}

                <div className="mines-modal-header">
                    <button className="modal-close" onClick={onClose}><X /></button>
                </div>

                <div className="mines-content">

                    {filteredUnlocked.length > 0 && filteredUnlocked.map(type => {
                        const config = minesConfig[type];
                        if (!config) return null;
                        const baseMineType = type.replace('_lvl2', '').replace('_lvl3', '');
                        const level = type.includes('_lvl3') ? 'lvl3' : type.includes('_lvl2') ? 'lvl2' : 'lvl1';

                        return (
                            <div key={type} className={`mine-card mine-card-${baseMineType} mine-card-${level}`}>
                                <button
                                    className={`btn-enter-mine${!set1Complete ? ' locked' : ''}`}
                                    onClick={() => set1Complete && onEnterMine(type)}
                                    disabled={!set1Complete}
                                    title={!set1Complete ? 'Reclama todas las recompensas de bienvenida primero' : undefined}
                                >
                                    {set1Complete ? 'Entrar' : '🔒'}
                                </button>
                            </div>
                        );
                    })}

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
                                        {config.requiresStars.stars} estrellas {config.requiresStars.mineType}
                                    </span>
                                )}
                                <button
                                    className={`btn-unlock-mine ${!canUnlock ? 'disabled' : ''}`}
                                    onClick={() => { if (canUnlock) onUnlockType(type); }}
                                    disabled={!canUnlock}
                                >
                                    <img src={iconGold} alt="gold" className="btn-cost-icon" />
                                    {formatNumber2(config.unlockCost)}
                                </button>
                            </div>
                        );
                    })}

                    {yacimientos && selectedBiome && (
                        <div className="yacimientos-section">
                            <div className="yacimientos-slots">
                                {yacimientos[selectedBiome].slots.map(slot => {
                                    const dogAssigned = getDogAssigned(slot.id);
                                    const unlockCost = yacimientos[selectedBiome].unlockCost;
                                    const rechargeCost = yacimientos[selectedBiome].rechargeCost;

                                    if (!slot.unlocked) {
                                        const canAffordSlot =
                                            currentGold >= unlockCost.gold &&
                                            tavernCoins >= unlockCost.tavernCoins;
                                        return (
                                            <div key={slot.id} className="yacimiento-slot locked">
                                                <div className="mena-locked-container">
                                                    <img
                                                        src={menaIntactAssets[selectedBiome]}
                                                        alt={selectedBiome}
                                                        className="mena-img"
                                                    />
                                                    <button
                                                        className="mena-lock-icon"
                                                        disabled={!canAffordSlot}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onUnlockYacimientoSlot(slot.id, selectedBiome);
                                                        }}
                                                    >
                                                        🔒
                                                    </button>
                                                </div>
                                                <div className="yacimiento-info">
                                                    <span className="mena-unlock-cost">
                                                        {formatNumber2(unlockCost.gold)}
                                                        <img src={iconGold} alt="gold" />
                                                    </span>
                                                    <span className="mena-unlock-cost">
                                                        {unlockCost.tavernCoins}
                                                        <img src={iconCoin} alt="coins" />
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <YacimientoSlotActivo
                                            key={slot.id}
                                            slot={slot}
                                            selectedBiome={selectedBiome}
                                            dogAssigned={dogAssigned}
                                            rechargeCost={rechargeCost}
                                            currentGold={currentGold}
                                            dogMenuOpen={dogMenuSlot === slot.id}
                                            availableDogs={getAvailableDogs()}
                                            formatNumber2={formatNumber2}
                                            iconGold={iconGold}
                                            menaAsset={menaIntactAssets[selectedBiome]}
                                            onActivate={() => onActivateYacimiento(slot.id, selectedBiome)}
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
    slot, selectedBiome, dogAssigned, rechargeCost, currentGold,
    dogMenuOpen, availableDogs, formatNumber2, iconGold, menaAsset,
    onActivate, onAssignDog, onUnassignDog, onToggleDogMenu,
}) => {
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [slotFlipped, setSlotFlipped] = useState(false);

    const session = slot.session;
    const isActive = session?.active === true;
    const isExpired = session && !session.active;

    useEffect(() => {
        if (!isActive) { setSecondsLeft(0); return; }
        const update = () => {
            const elapsed = Date.now() - session.startedAt;
            const remaining = Math.max(0, Math.ceil((SESSION_DURATION - elapsed) / 1000));
            setSecondsLeft(remaining);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [isActive, session?.startedAt]); // eslint-disable-line

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const canAffordRecharge = currentGold >= rechargeCost.gold;

    const sessionLabel = () => {
        if (!dogAssigned) return null;
        if (isActive) return <span className="yacimiento-timer">{formatTime(secondsLeft)}</span>;
        if (isExpired) return (
            <button
                className={`yacimiento-activate-btn recharge ${!canAffordRecharge ? 'disabled' : ''}`}
                disabled={!canAffordRecharge}
                onClick={(e) => { e.stopPropagation(); onActivate(); }}
            >
                <img src={iconGold} alt="gold" />
                {formatNumber2(rechargeCost.gold)} Recargar
            </button>
        );
        return (
            <button
                className={`yacimiento-activate-btn ${!canAffordRecharge ? 'disabled' : ''}`}
                disabled={!canAffordRecharge}
                onClick={(e) => { e.stopPropagation(); onActivate(); }}
            >
                <img src={iconGold} alt="gold" />
                {formatNumber2(rechargeCost.gold)} Activar
            </button>
        );
    };

    return (
        <div className={`yacimiento-slot active${isActive ? ' session-active' : ''}`}>
            <div className="yacimiento-mena-wrapper">
                <img src={menaAsset} alt={selectedBiome} className={`yacimiento-mena-img${isActive ? ' mena-mining' : ''}`} />
                <div className="yacimiento-mena-overlay">
                    {!dogAssigned ? (
                        <span className="yacimiento-no-dog">Asigna un perro</span>
                    ) : (
                        sessionLabel()
                    )}
                </div>
            </div>

            <div
                className={`dog-slot-box${dogAssigned ? ` dog-rarity-${DogsConfig[dogAssigned.id]?.rarity}` : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (dogAssigned) setSlotFlipped(f => !f);
                    onToggleDogMenu();
                }}
            >
                <div className={`dog-slot-flip${slotFlipped && dogAssigned ? ' flipped' : ''}`}>
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
                    {dogAssigned && (() => {
                        const cfg = DogsConfig[dogAssigned.id];
                        return (
                            <div className="dog-slot-back">
                                <span>+{cfg?.yacimientoYield ?? 1}/tick</span>
                                <span>2s por tick</span>
                            </div>
                        );
                    })()}
                </div>

                {dogMenuOpen && (
                    <div className="dog-menu">
                        {availableDogs.length === 0
                            ? <span className="dog-menu-empty">Sin mascotas libres</span>
                            : availableDogs.map(dog => (
                                <button key={dog.id} className="dog-menu-option"
                                    onClick={(e) => { e.stopPropagation(); onAssignDog(dog.id, selectedBiome, slot.id); onToggleDogMenu(); }}
                                >{DogsConfig[dog.id]?.name ?? dog.id}</button>
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
