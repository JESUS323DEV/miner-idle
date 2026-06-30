import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Zap, Pickaxe, Swords, Flame, X, Star } from 'lucide-react';
import { DogsConfig } from '../game/config/DogsConfig.js';
import { ForgeDogsConfig } from '../game/config/ForgeDogsConfig.js';
import { getDogStats } from '../game/utils/getDogStats.js';
import { dogAssets } from '../game/utils/dogAssets.js';
import { formatRentalTimer } from '../game/utils/formatters.js';
import { useGameContext } from '../game/context/GameContext.jsx';
import { useFloatingNumbers } from '../game/hooks/useFloatingNumbers.js';

const RARITY_ORDER = { legendary: 0, epic: 1, rare: 2, common: 3 };

const renderPassive = (id, stars, isForge) => {
    const scaled = getDogStats(id, stars ?? 0, isForge);
    const bonus = isForge ? scaled?.globalSlotBonus : scaled?.goldMineBonus;
    if (!bonus) return <span>Sin pasiva</span>;
    if (bonus.type === 'extraGold') return <><span>+{bonus.value} oro</span><span>por picada</span></>;
    if (bonus.type === 'saveDurability') return <><span>{Math.round(bonus.chance * 100)}%</span><span>sin gastar</span><span>durabilidad</span></>;
    if (bonus.type === 'doubleHit') return <><span>{Math.round(bonus.chance * 100)}%</span><span>doblar oro</span></>;
    if (bonus.type === 'goldTrickle') return <><span>+{bonus.min === bonus.max ? bonus.min : `${bonus.min}-${bonus.max}`}</span><span>oro / 60s</span></>;
    if (bonus.type === 'burstRecharge') return <><span>{Math.round(bonus.chance * 100)}%</span><span>recarga energía</span></>;
    if (bonus.type === 'maxDurability') return <><span>+{bonus.value}</span><span>durabilidad máx.</span></>;
    return null;
};

const getDogStatus = (dog, isForge) => {
    if (!dog.assignedTo) return 'available';
    const a = dog.assignedTo;
    if (a.tavern) return 'inTavern';
    if (isForge) {
        if (typeof a === 'string') return 'inFurnace';
        if (a.globalSlot !== undefined) return 'inSlot';
        if (a.type === 'raid') return 'inRaid';
    } else {
        if (a.globalSlot !== undefined) return 'inSlot';
        if (a.biome) return 'inYacimiento';
        if (a.mineComp !== undefined) return 'inYacimiento';
        if (a.type === 'raid') return 'inRaid';
    }
    return 'available';
};

export default function GlobalDogSlots({ gameState, setGameState, tutorialStep, hidden }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [infoCardId, setInfoCardId] = useState(null);
    const [flashFull, setFlashFull] = useState(false);
    const [activeTab, setActiveTab] = useState('minero');
    const [raritySort, setRaritySort] = useState(null);

    const { mineClickCount } = useGameContext();
    const { floats, add } = useFloatingNumbers();
    const slotRefs = useRef([null, null, null]);
    const gameStateRef = useRef(gameState);
    gameStateRef.current = gameState;
    const lastMineBonusRef = useRef(null);

    useEffect(() => {
        if (mineClickCount === 0) return;
        const gs = gameStateRef.current;
        const lastBonus = gs.lastMineBonus;
        const isNewBonus = lastBonus !== lastMineBonusRef.current;
        lastMineBonusRef.current = lastBonus;

        const slots = gs.dogs?.globalSlots ?? [];
        slots.forEach((dogId, i) => {
            if (!dogId) return;
            const isForge = dogId in ForgeDogsConfig;
            const dog = isForge ? gs.forgeDogs?.[dogId] : gs.dogs[dogId];
            const stars = dog?.stars ?? 0;
            const scaled = getDogStats(dogId, stars, isForge);
            const bonus = isForge ? scaled?.globalSlotBonus : scaled?.goldMineBonus;
            if (!bonus) return;

            const el = slotRefs.current[i];
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top;

            if (bonus.type === 'extraGold') {
                add('slotExtraGold', { value: bonus.value, x, y }, 1200);
            } else if (bonus.type === 'doubleHit' && isNewBonus && lastBonus?.doubleHitCount > 0) {
                add('slotDoubleHit', { multiplier: 1 + lastBonus.doubleHitCount, x, y }, 900);
            } else if (bonus.type === 'saveDurability' && isNewBonus && lastBonus?.savedDurability) {
                add('slotSaveDurability', { x, y }, 1000);
            } else if (bonus.type === 'burstRecharge' && isNewBonus && lastBonus?.burstReduced > 0) {
                add('slotBurstRecharge', { value: lastBonus.burstReduced, x, y }, 1000);
            }
        });
    }, [mineClickCount, add]);

    const openModal = () => {
        setModalOpen(true);
        setRaritySort(null);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const assignDog = (dogId, isForge) => {
        const slots = gameState.dogs.globalSlots ?? [null, null, null];
        const emptyIdx = slots.findIndex(id => id === null);
        if (emptyIdx === -1) {
            setFlashFull(true);
            setTimeout(() => setFlashFull(false), 600);
            return;
        }
        setGameState(prev => {
            const newSlots = (prev.dogs.globalSlots ?? [null, null, null]).map((id, i) => i === emptyIdx ? dogId : id);
            if (isForge) {
                return { ...prev, dogs: { ...prev.dogs, globalSlots: newSlots }, forgeDogs: { ...prev.forgeDogs, [dogId]: { ...prev.forgeDogs[dogId], assignedTo: { globalSlot: emptyIdx } } } };
            }
            return { ...prev, dogs: { ...prev.dogs, globalSlots: newSlots, [dogId]: { ...prev.dogs[dogId], assignedTo: { globalSlot: emptyIdx } } } };
        });
    };

    const unassignSlot = (slotIdx) => {
        setGameState(prev => {
            const currentDogId = (prev.dogs.globalSlots ?? [null, null, null])[slotIdx];
            if (!currentDogId) return prev;
            const newSlots = (prev.dogs.globalSlots ?? [null, null, null]).map((id, i) => i === slotIdx ? null : id);
            const currIsForge = currentDogId in ForgeDogsConfig;
            if (currIsForge) {
                return { ...prev, dogs: { ...prev.dogs, globalSlots: newSlots }, forgeDogs: { ...prev.forgeDogs, [currentDogId]: { ...prev.forgeDogs[currentDogId], assignedTo: null } } };
            }
            return { ...prev, dogs: { ...prev.dogs, globalSlots: newSlots, [currentDogId]: { ...prev.dogs[currentDogId], assignedTo: null } } };
        });
    };

    const getDogPool = () => {
        const pool = [];

        if (activeTab === 'minero') {
            Object.entries(gameState.dogs).forEach(([id, dog]) => {
                if (id === 'globalSlots' || !dog || typeof dog !== 'object' || !dog.hired) return;
                pool.push({ id, dog, cfg: DogsConfig[id], status: getDogStatus(dog, false), isForge: false });
            });
        } else {
            Object.entries(gameState.forgeDogs ?? {}).forEach(([id, dog]) => {
                if (!dog || typeof dog !== 'object' || !dog.hired) return;
                pool.push({ id, dog, cfg: ForgeDogsConfig[id], status: getDogStatus(dog, true), isForge: true });
            });
        }

        pool.sort((a, b) => {
            if (raritySort) {
                const aFirst = a.cfg?.rarity === raritySort ? 0 : 1;
                const bFirst = b.cfg?.rarity === raritySort ? 0 : 1;
                if (aFirst !== bFirst) return aFirst - bFirst;
            }
            return (RARITY_ORDER[a.cfg?.rarity] ?? 9) - (RARITY_ORDER[b.cfg?.rarity] ?? 9);
        });

        return pool;
    };

    return (
        <>
            <div
                className="global-slots-area"
                style={hidden ? { visibility: 'hidden' } : tutorialStep === 'hint_mine_dog' ? { zIndex: 600 } : undefined}
            >
                <div className="global-dog-slots">
                    {[0, 1, 2].map(i => {
                        const assignedDogId = (gameState.dogs.globalSlots ?? [null, null, null])[i] ?? null;
                        const assignedDog = assignedDogId ? (gameState.dogs[assignedDogId] ?? gameState.forgeDogs?.[assignedDogId] ?? null) : null;
                        const assignedRarity = assignedDogId ? (DogsConfig[assignedDogId]?.rarity ?? ForgeDogsConfig[assignedDogId]?.rarity ?? null) : null;
                        const rentalEntry = (gameState.rental?.active ?? []).find(r => r.assignedSlot === i && r.dogId === assignedDogId);
                        const isRentedSlot = !!rentalEntry;
                        const isZeusTutorialSlot = tutorialStep === 'hint_mine_dog' && assignedDogId === 'zeus';

                        return (
                            <div
                                key={i}
                                ref={el => slotRefs.current[i] = el}
                                className={`global-dog-slot-wrapper${isRentedSlot ? ' global-dog-slot-rented' : ''}${isZeusTutorialSlot ? ' tutorial-highlight' : ''}`}
                            >
                                <div
                                    className={`global-dog-slot${assignedRarity ? ` dog-rarity-${assignedRarity}` : ''}`}
                                    onClick={openModal}
                                >
                                    {assignedDog ? (
                                        <>
                                            {dogAssets[assignedDogId]
                                                ? <img src={dogAssets[assignedDogId]} className="global-dog-slot-img" alt={assignedDogId} />
                                                : <span className="global-dog-slot-emoji">🐕</span>
                                            }
                                            {isRentedSlot && (
                                                <span className="global-dog-slot-rental-badge">{formatRentalTimer(rentalEntry.remainingMs)}</span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="global-dog-slot-plus">+</span>
                                    )}
                                </div>
                                {assignedDog && (
                                    <span className="global-dog-slot-name">{DogsConfig[assignedDogId]?.name ?? ForgeDogsConfig[assignedDogId]?.name ?? assignedDogId}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {modalOpen && createPortal(
                <>
                    <div className="gds-overlay" onClick={closeModal} />
                    <div className="gds-modal">
                        <div className="gds-header">
                            <button className="gds-close" onClick={closeModal}><X size={16} /></button>
                            <div className="gds-tabs">
                                <button className={`gds-tab${activeTab === 'minero' ? ' active' : ''}`} onClick={() => setActiveTab('minero')}>Minero</button>
                                <button className={`gds-tab${activeTab === 'forja' ? ' active' : ''}`} onClick={() => setActiveTab('forja')}>Forja</button>
                            </div>
                        </div>

                        <div className="gds-rarity-bar">
                            {['legendary', 'epic', 'rare'].map(r => (
                                <button
                                    key={r}
                                    className={`gds-rarity-btn rarity-${r}${raritySort === r ? ' active' : ''}`}
                                    onClick={() => setRaritySort(raritySort === r ? null : r)}
                                >
                                    {r === 'legendary' ? 'Leg.' : r === 'epic' ? 'Épico' : 'Raro'}
                                </button>
                            ))}
                        </div>

                        <div className="gds-grid">
                            {getDogPool().length === 0 && (
                                <span className="gds-empty">Sin mascotas {activeTab === 'minero' ? 'mineras' : 'de forja'} disponibles</span>
                            )}
                            {getDogPool().map(({ id, dog, cfg, status, isForge }) => {
                                const unavailable = status !== 'available';
                                const showInfo = infoCardId === id;
                                return (
                                    <div
                                        key={id}
                                        className={`gds-card dog-rarity-${cfg?.rarity}${unavailable ? ' unavailable' : ''}`}
                                        onClick={() => { if (!showInfo && !unavailable) assignDog(id, isForge); }}
                                    >
                                        <button className="fdm-info-btn" onClick={e => { e.stopPropagation(); setInfoCardId(showInfo ? null : id); }}>i</button>
                                        <div className="gds-card-img-wrap">
                                            <img src={dogAssets[id]} className="gds-card-img" alt={id} />
                                            {(status === 'inYacimiento' || status === 'inSlot') && <span className="gds-status-badge"><Pickaxe size={9} /></span>}
                                            {status === 'inRaid' && <span className="gds-status-badge"><Swords size={9} /></span>}
                                            {status === 'inFurnace' && <span className="gds-status-badge"><Flame size={9} /></span>}
                                        </div>
                                        <span className="gds-card-name">{cfg?.name ?? id}</span>
                                        <div className="fdm-card-stars">
                                            {[0,1,2,3,4].map(i => (
                                                <Star key={i} size={8} fill={i < (dog.stars ?? 0) ? '#f5c842' : 'none'} color={i < (dog.stars ?? 0) ? '#f5c842' : '#555'} />
                                            ))}
                                        </div>
                                        {showInfo && (
                                            <div className="gds-card-info-overlay" onClick={e => { e.stopPropagation(); setInfoCardId(null); }}>
                                                {renderPassive(id, dog.stars, isForge)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className={`gds-slots-row${flashFull ? ' flash-full' : ''}`}>
                            {[0, 1, 2].map(i => {
                                const dogId = (gameState.dogs.globalSlots ?? [])[i] ?? null;
                                const dog = dogId ? (gameState.dogs[dogId] ?? gameState.forgeDogs?.[dogId] ?? null) : null;
                                const rarity = dogId ? (DogsConfig[dogId]?.rarity ?? ForgeDogsConfig[dogId]?.rarity ?? null) : null;
                                const isRented = (gameState.rental?.active ?? []).some(r => r.assignedSlot === i && r.dogId === dogId);
                                return (
                                    <div key={i} className="gds-slot-wrap">
                                        <div className="gds-modal-slot-wrap">
                                            <div className={`gds-modal-slot${rarity ? ` dog-rarity-${rarity}` : ''}`}>
                                                {dog
                                                    ? <img src={dogAssets[dogId]} className="global-dog-slot-img" alt={dogId} />
                                                    : <span className="global-dog-slot-plus">+</span>
                                                }
                                            </div>
                                            {dog && !isRented && (
                                                <button
                                                    className="gds-slot-unassign"
                                                    onClick={e => { e.stopPropagation(); unassignSlot(i); }}
                                                >
                                                    <X size={9} />
                                                </button>
                                            )}
                                        </div>
                                        {dog && (
                                            <span className="gds-slot-name">{DogsConfig[dogId]?.name ?? ForgeDogsConfig[dogId]?.name ?? dogId}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>,
                document.body
            )}

            {createPortal(
                floats.map(f => {
                    if (f.type === 'slotExtraGold') return <div key={f.id} className="floating-slot-extra-gold" style={{ left: f.x, top: f.y }}>+{f.value}</div>;
                    if (f.type === 'slotDoubleHit') return <div key={f.id} className="floating-slot-double-hit" style={{ left: f.x, top: f.y }}>x{f.multiplier}!</div>;
                    if (f.type === 'slotSaveDurability') return <div key={f.id} className="floating-slot-save-durability" style={{ left: f.x, top: f.y }}><Shield size={18} /></div>;
                    if (f.type === 'slotBurstRecharge') return <div key={f.id} className="floating-slot-burst-recharge" style={{ left: f.x, top: f.y }}><Zap size={13} />-{f.value}s</div>;
                    return null;
                }),
                document.body
            )}
        </>
    );
}
