import { useState, useEffect, useRef } from 'react';
import '../../styles/modals/MinesMapModal.css';
import '../../styles/modals/MineScreen.css';
import MinesConfig from '../../game/config/MinesConfig.js';
import { useGameContext } from '../../game/context/GameContext.jsx';
import { DogsConfig, RARITY_COLORS } from '../../game/config/DogsConfig.js';
import { SESSION_DURATION, COOLDOWN_DURATION } from '../../game/initialState/InitialYacimientosState.js';
import { MineCompanionConfig, ELEMENT_COLORS } from '../../game/config/MineCompanionConfig.js';
import { formatNumber2 } from '../../game/utils/formatters.js';

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

import menaBronze3   from "../../assets/ui/icons-menas/menas-bronze/mena-bronze3.webp"
import menaIron3     from "../../assets/ui/icons-menas/menas-iron/mena-iron3.webp"
import menaDiamond3  from "../../assets/ui/icons-menas/menas-diamond/mena-diamond3.webp"
const menaIntactAssets = { bronze: menaBronze3, iron: menaIron3, diamond: menaDiamond3 };

import ladyIcon   from "../../assets/ui/icons-pets/mineros/lady-icon.webp"
import tokyoIcon  from "../../assets/ui/icons-pets/mineros/tokyo-icon.webp"
import tukaIcon   from "../../assets/ui/icons-pets/mineros/tuka-icon.webp"
import munaIcon   from "../../assets/ui/icons-pets/mineros/muna-icon.webp"
import gordoIcon  from "../../assets/ui/icons-pets/mineros/gordo-icon.webp"
import druhIcon   from "../../assets/ui/icons-pets/mineros/druh-icon.webp"
import smokeIcon  from "../../assets/ui/icons-pets/mineros/smoke-icon.webp"
import nupitoIcon from "../../assets/ui/icons-pets/mineros/nupito-icon.webp"
import zeusIcon      from "../../assets/ui/icons-pets/mineros/zeus-icon.webp"
import boxerIcon     from "../../assets/ui/icons-pets/mineros/boxer-icon.webp"
import bullyIcon     from "../../assets/ui/icons-pets/mineros/bully-icon.webp"
import chihuahuaIcon from "../../assets/ui/icons-pets/mineros/chihuhua-icon.webp"
const dogAssets = {
    lady: ladyIcon, tokio: tokyoIcon, tuka: tukaIcon,
    muna: munaIcon, gordo: gordoIcon, druh: druhIcon,
    smoke: smokeIcon, nupito: nupitoIcon, zeus: zeusIcon,
    boxer: boxerIcon, bully: bullyIcon, chihuahua: chihuahuaIcon,
};

import iconGold from "../../assets/ui/icons-hud/hud-principal/oro1.webp"
import iconCoin from "../../assets/ui/icons-hud/hud-principal/coin-tavern1.webp"

import bronzeHud from "../../assets/ui/icons-forge/menas-hud/bronzeHud.webp"
import ironHud from "../../assets/ui/icons-forge/menas-hud/ironHud.webp"
import diamondHud from "../../assets/ui/icons-forge/menas-hud/diamondHud.webp"

import { X, PawPrint } from 'lucide-react';
import MineDogModal from './MineDogModal.jsx';

const biomeHudAssets = {
    bronze: bronzeHud,
    iron: ironHud,
    diamond: diamondHud,
};

const fmtRentalTime = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const MinesMapModal = ({ isOpen, onClose, selectedBiome = null, bgImage = null, onEnterMine, set1Complete = true }) => {
    const {
        gameState,
        setGameState,
        handleUnlockMineType: onUnlockType,
        handleUnlockYacimientoSlot: onUnlockYacimientoSlot,
        handleAssignMineDog,
        handleUnassignMineDog,
    } = useGameContext();
    const { gold: currentGold, tavernCoins, mines, yacimientos, dogs = {} } = gameState;
    const { unlockedTypes, bestScores } = mines;
    const minesConfig = MinesConfig;

    const [showIntro, setShowIntro] = useState(false);
    const [compAnimTick, setCompAnimTick] = useState(0);
    const lastCompTickRef = useRef(null);
    const [preEntryMine, setPreEntryMine] = useState(null);
    const [selectedCompanion, setSelectedCompanion] = useState(null);
    const [mineCompModalOpen, setMineCompModalOpen] = useState(false);

    useEffect(() => {
        if (!isOpen || !selectedBiome) return;
        const flag = INTRO_FLAG[selectedBiome];
        if (flag && !gameState.tutorial?.[flag]) {
            setShowIntro(true);
        }
    }, [isOpen, selectedBiome]); // eslint-disable-line

    useEffect(() => {
        if (!isOpen || !selectedBiome) return;
        const compDog = Object.values(dogs).find(
            d => d && typeof d === 'object' && !Array.isArray(d) && d.assignedTo?.mineComp === selectedBiome
        );
        const tick = compDog?.mineCompLastTick;
        if (!tick || tick === lastCompTickRef.current) return;
        lastCompTickRef.current = tick;
        setCompAnimTick(n => n + 1);
    }, [dogs, isOpen, selectedBiome]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!isOpen) return null;

    const mineCompDog = selectedBiome
        ? Object.values(dogs).find(d => d && typeof d === 'object' && !Array.isArray(d) && d.assignedTo?.mineComp === selectedBiome) || null
        : null;
    const mineCompLocked = (mineCompDog?.mineCompTimer?.remaining ?? 0) > 0;
    const fmtTimer = (s) => { const m = Math.floor(s / 60); const sec = s % 60; return `${m}:${sec.toString().padStart(2, '0')}`; };

    const getAvailableCompanions = () => {
        const owned = Object.values(dogs).filter(d =>
            d && d.hired && (d.assignedTo === null || d.assignedTo?.globalSlot !== undefined)
        );
        const rented = (gameState.rental?.active ?? [])
            .filter(r => r.destination === 'slot' && r.remainingMs > 0)
            .map(r => ({ id: r.dogId, stars: 0, isRented: true, remainingMs: r.remainingMs }));
        return [...owned, ...rented];
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
                                    onClick={() => { if (set1Complete) { setPreEntryMine(type); setSelectedCompanion(null); } }}
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

                    {preEntryMine && (
                        <PreEntryScreen
                            mineType={preEntryMine}
                            availableCompanions={getAvailableCompanions()}
                            selectedCompanion={selectedCompanion}
                            onSelectCompanion={setSelectedCompanion}
                            onConfirm={() => {
                                onEnterMine(preEntryMine, selectedCompanion);
                                setPreEntryMine(null);
                                setSelectedCompanion(null);
                            }}
                            onCancel={() => { setPreEntryMine(null); setSelectedCompanion(null); }}
                        />
                    )}

                    {yacimientos && selectedBiome && (
                        <div className="yacimientos-section">
                            <div className="yacimientos-slots">
                                {yacimientos[selectedBiome].slots.map(slot => {
                                    const unlockCost = yacimientos[selectedBiome].unlockCost;

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

                                    const dogAssigned = Object.values(dogs).find(
                                        d => d && typeof d === 'object' && d.assignedTo?.biome === selectedBiome && d.assignedTo?.slotId === slot.id
                                    ) || null;
                                    return (
                                        <YacimientoSlotActivo
                                            key={slot.id}
                                            slot={slot}
                                            selectedBiome={selectedBiome}
                                            menaAsset={menaIntactAssets[selectedBiome]}
                                            dogAssigned={dogAssigned}
                                            compAnimTick={compAnimTick}
                                            compDogAssigned={mineCompDog}
                                        />
                                    );
                                })}
                            </div>

                            {/* SLOT COMPAÑERO DE MINA */}
                            {yacimientos[selectedBiome].slots.some(s => s.unlocked) && <div className="mdc-companion-row" style={{ position: 'relative' }}>
                                <div
                                    className={`dog-slot-box${mineCompDog ? ` dog-rarity-${DogsConfig[mineCompDog.id]?.rarity}` : ''}`}
                                    onClick={() => setMineCompModalOpen(true)}
                                >
                                    {mineCompDog ? (
                                        <>
                                            <img src={dogAssets[mineCompDog.id]} className="dog-slot-img" alt={mineCompDog.id} />
                                            {mineCompLocked && (
                                                <div className="dog-slot-timer-overlay">
                                                    <span className="mdc-slot-timer">{fmtTimer(mineCompDog.mineCompTimer.remaining)}</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <span className="dog-slot-plus">+</span>
                                    )}
                                </div>
                                <span className="dog-slot-label">
                                    {mineCompDog ? (DogsConfig[mineCompDog.id]?.name ?? mineCompDog.id) : 'compañero'}
                                </span>
                            </div>}
                        </div>
                    )}

                </div>
            </div>

            {mineCompModalOpen && selectedBiome && (
                <MineDogModal
                    isOpen={mineCompModalOpen}
                    onClose={() => setMineCompModalOpen(false)}
                    mineId={selectedBiome}
                    dogs={dogs}
                    onAssign={handleAssignMineDog}
                    onUnassign={handleUnassignMineDog}
                />
            )}
        </div>
    );
};


const YacimientoSlotActivo = ({ slot, selectedBiome, menaAsset, dogAssigned, compAnimTick, compDogAssigned }) => {
    const [isShaking, setIsShaking] = useState(false);
    const [floats, setFloats] = useState([]);
    const lastTickRef = useRef(null);
    const lastCompTickRef = useRef(0);

    const session = slot.session;
    const phase = session?.phase;
    const isMining = phase === 'mining';
    const isCooldown = phase === 'cooldown';

    useEffect(() => {
        const tick = session?.lastTick;
        if (!tick || tick === lastTickRef.current) return;
        lastTickRef.current = tick;
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 150);

        const dogConfig = dogAssigned ? DogsConfig[dogAssigned.id] : null;
        const starMult = 1 + (dogConfig?.starBonus ?? 0) * (dogAssigned?.stars ?? 0);
        const baseYield = dogConfig?.yacimientoYield ?? 1;
        const biomeBonusRaw = dogConfig?.biomeBonus?.[selectedBiome] ?? 1.0;
        const biomeMult = Array.isArray(biomeBonusRaw) ? (biomeBonusRaw[Math.min(5, dogAssigned?.stars ?? 0)] ?? 1.0) : biomeBonusRaw;
        const displayYield = Math.round(baseYield * biomeMult * starMult);

        const floatId = Date.now();
        setFloats(prev => [...prev, { id: floatId, value: displayYield }]);
        setTimeout(() => setFloats(prev => prev.filter(f => f.id !== floatId)), 900);
    }, [session?.lastTick]); // eslint-disable-line

    useEffect(() => {
        if (!compAnimTick || compAnimTick === lastCompTickRef.current) return;
        lastCompTickRef.current = compAnimTick;

        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 150);

        const dogConfig = compDogAssigned ? DogsConfig[compDogAssigned.id] : null;
        const starMult = 1 + (dogConfig?.starBonus ?? 0) * (compDogAssigned?.stars ?? 0);
        const baseYield = dogConfig?.yacimientoYield ?? 1;
        const biomeBonusRaw2 = dogConfig?.biomeBonus?.[selectedBiome] ?? 1.0;
        const biomeMult = Array.isArray(biomeBonusRaw2) ? (biomeBonusRaw2[Math.min(5, compDogAssigned?.stars ?? 0)] ?? 1.0) : biomeBonusRaw2;
        const displayYield = Math.round(baseYield * biomeMult * starMult);

        const floatId = Date.now() + Math.random();
        setFloats(prev => [...prev, { id: floatId, value: displayYield }]);
        setTimeout(() => setFloats(prev => prev.filter(f => f.id !== floatId)), 900);
    }, [compAnimTick]); // eslint-disable-line

    return (
        <div className={`yacimiento-slot active${isMining ? ' session-mining' : ''}${isCooldown ? ' session-cooldown' : ''}`}>
            <div className={`yacimiento-mena-wrapper${isShaking ? ' mena-shake' : ''}`}>
                <img
                    src={menaAsset}
                    alt={selectedBiome}
                    className={`yacimiento-mena-img${isMining ? ' mena-mining' : ''}${isCooldown ? ' mena-cooldown' : ''}`}
                />
                {floats.map(f => (
                    <div key={f.id} className="mena-floating">
                        +{f.value} <img src={biomeHudAssets[selectedBiome]} alt="" className="mena-floating-icon" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const PreEntryScreen = ({ mineType, availableCompanions, selectedCompanion, onSelectCompanion, onConfirm, onCancel }) => {
    const selectedDog = selectedCompanion && selectedCompanion !== '__none__'
        ? availableCompanions.find(d => d.id === selectedCompanion)
        : null;
    const selectedCfg = selectedDog ? DogsConfig[selectedDog.id] : null;
    const selectedCompCfg = selectedDog ? MineCompanionConfig[selectedDog.id] : null;
    const selectedRarityColor = selectedCfg ? (RARITY_COLORS[selectedCfg.rarity] ?? '#aaa') : 'rgba(255,165,0,0.4)';
    const selectedElemColor = selectedCompCfg ? ELEMENT_COLORS[selectedCompCfg.element] : '#aaa';
    const noCompanion = !selectedCompanion || selectedCompanion === '__none__';

    return (
        <div className="pre-entry-overlay">
            <div className="pre-entry-panel">
                <h3 className="pre-entry-title">Elige tu ayudante</h3>
                <p className="pre-entry-sub">
                    {mineType.replace('_lvl2',' II').replace('_lvl3',' III').replace('bronze','Bronce').replace('iron','Hierro').replace('diamond','Diamante')}
                </p>

                {/* SLOT EQUIPADO */}
                <div className="pre-entry-slot-wrap">
                    <div className="pre-entry-slot" style={{ borderColor: selectedRarityColor }}>
                        {selectedDog ? (
                            <>
                                {dogAssets[selectedDog.id] && (
                                    <img src={dogAssets[selectedDog.id]} alt={selectedCfg?.name} className="pre-entry-slot-img" />
                                )}
                                <span className="pre-entry-slot-name">{selectedCfg?.name ?? selectedDog.id}</span>
                                {selectedCompCfg && (
                                    <span className="pre-entry-slot-elem" style={{ color: selectedElemColor }}>
                                        {selectedCompCfg.element}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="pre-entry-slot-empty">?</span>
                        )}
                    </div>
                    {noCompanion && (
                        <p className="pre-entry-warning">Sin ayudante: automine base activo, sin poderes.</p>
                    )}
                </div>

                {/* GRID DE PERROS */}
                <div className="pre-entry-dogs-grid">
                    <button
                        className={`pre-entry-dog-circle${selectedCompanion === '__none__' ? ' selected' : ''}`}
                        onClick={() => onSelectCompanion('__none__')}
                    >
                        <div className="pre-entry-circle-icon pre-entry-circle-none">
                            <span>?</span>
                        </div>
                        <span className="pre-entry-circle-name">Ninguno</span>
                    </button>

                    {availableCompanions.map(dog => {
                        const cfg = DogsConfig[dog.id];
                        const compCfg = MineCompanionConfig[dog.id];
                        const elemColor = compCfg ? ELEMENT_COLORS[compCfg.element] : '#aaa';
                        const rarityColor = RARITY_COLORS[cfg?.rarity] ?? '#aaa';
                        const icon = dogAssets[dog.id];
                        return (
                            <button
                                key={dog.id}
                                className={`pre-entry-dog-circle${selectedCompanion === dog.id ? ' selected' : ''}`}
                                onClick={() => onSelectCompanion(dog.id)}
                            >
                                <div className="pre-entry-circle-icon" style={{ borderColor: rarityColor }}>
                                    {icon && <img src={icon} alt={cfg?.name} className="pre-entry-circle-img" />}
                                </div>
                                <span className="pre-entry-circle-name">{cfg?.name ?? dog.id}</span>
                                {compCfg && (
                                    <span className="pre-entry-circle-elem" style={{ color: elemColor }}>
                                        {compCfg.element}
                                    </span>
                                )}
                                {dog.isRented && (
                                    <span className="pre-entry-circle-rental">{fmtRentalTime(dog.remainingMs)}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="pre-entry-actions">
                    <button className="pre-entry-cancel" onClick={onCancel}>Cancelar</button>
                    <button
                        className="pre-entry-confirm"
                        onClick={onConfirm}
                        disabled={!selectedCompanion}
                    >
                        Entrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MinesMapModal;
