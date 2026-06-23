import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Zap } from 'lucide-react';
import { DogsConfig } from '../game/config/DogsConfig.js';
import { ForgeDogsConfig } from '../game/config/ForgeDogsConfig.js';
import { getDogStats } from '../game/utils/getDogStats.js';
import { dogAssets } from '../game/utils/dogAssets.js';
import { formatRentalTimer } from '../game/utils/formatters.js';
import { useGameContext } from '../game/context/GameContext.jsx';
import { useFloatingNumbers } from '../game/hooks/useFloatingNumbers.js';

const renderPassiveBack = (assignedDogId, assignedDog) => {
    if (!assignedDogId) return null;
    const isForge = assignedDogId in ForgeDogsConfig;
    const stars = assignedDog?.stars ?? 0;
    const scaledConfig = getDogStats(assignedDogId, stars, isForge);
    const bonus = isForge ? scaledConfig?.globalSlotBonus : scaledConfig?.goldMineBonus;
    if (!bonus) return null;
    if (bonus.type === 'extraGold') return <><span>+{bonus.value} oro</span><span>por picada</span></>;
    if (bonus.type === 'saveDurability') return <><span>{Math.round(bonus.chance * 100)}%</span><span>sin gastar</span><span>durabilidad</span></>;
    if (bonus.type === 'doubleHit') return <><span>{Math.round(bonus.chance * 100)}%</span><span>de doblar</span><span>el oro</span></>;
    if (bonus.type === 'goldTrickle') return <><span>+{bonus.min === bonus.max ? bonus.min : `${bonus.min}-${bonus.max}`}</span><span>oro cada</span><span>60s</span></>;
    if (bonus.type === 'burstRecharge') return <><span>{Math.round(bonus.chance * 100)}%</span><span>recarga</span><span>energía</span></>;
    if (bonus.type === 'maxDurability') return <><span>+{bonus.value}</span><span>durabilidad</span><span>máx.</span></>;
    return null;
};

export default function GlobalDogSlots({ gameState, setGameState, tutorialStep, hidden }) {
    const [globalDogMenuOpen, setGlobalDogMenuOpen] = useState(null);
    const [flippedSlot, setFlippedSlot] = useState(null);

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

    return (
        <>
            <div className="global-dog-slots" style={hidden ? { visibility: 'hidden' } : tutorialStep === 'hint_mine_dog' ? { zIndex: 600 } : undefined}>
                {[0, 1, 2].map(i => {
                    const assignedDogId = (gameState.dogs.globalSlots ?? [null, null, null])[i] ?? null;
                    const assignedDog = assignedDogId ? (gameState.dogs[assignedDogId] ?? gameState.forgeDogs?.[assignedDogId] ?? null) : null;
                    const availableDogs = [
                        ...Object.values(gameState.dogs).filter(d => d && typeof d === 'object' && !Array.isArray(d) && d.hired && d.assignedTo === null),
                        ...Object.values(gameState.forgeDogs ?? {}).filter(d => d && typeof d === 'object' && !Array.isArray(d) && d.hired && d.assignedTo === null),
                    ];
                    const isMenuOpen = globalDogMenuOpen === i;
                    const isFlipped = flippedSlot === i;
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
                                onClick={() => {
                                    if (isRentedSlot) {
                                        setFlippedSlot(isFlipped ? null : i);
                                        return;
                                    }
                                    if (assignedDog) {
                                        setFlippedSlot(isFlipped ? null : i);
                                        setGlobalDogMenuOpen(isMenuOpen ? null : i);
                                    } else {
                                        setGlobalDogMenuOpen(isMenuOpen ? null : i);
                                    }
                                }}
                            >
                                <div className={`global-slot-flip${isFlipped ? ' flipped' : ''}`}>
                                    <div className="global-slot-front">
                                        {assignedDog ? (
                                            <>
                                                {dogAssets[assignedDogId]
                                                    ? <img src={dogAssets[assignedDogId]} className="global-dog-slot-img" alt={assignedDogId} />
                                                    : <span className="global-dog-slot-emoji">🐕</span>
                                                }
                                                {isRentedSlot && (
                                                    <span className="global-dog-slot-rental-badge">{formatRentalTimer(rentalEntry.remainingMs)}</span>
                                                )}
                                                {!isRentedSlot && (
                                                    <button className="global-dog-slot-unassign" onClick={e => {
                                                        e.stopPropagation();
                                                        setFlippedSlot(null);
                                                        const isForge = assignedDogId in ForgeDogsConfig;
                                                        setGameState(prev => {
                                                            const newSlots = (prev.dogs.globalSlots ?? [null, null, null]).map((id, idx) => idx === i ? null : id);
                                                            if (isForge) {
                                                                return { ...prev, dogs: { ...prev.dogs, globalSlots: newSlots }, forgeDogs: { ...prev.forgeDogs, [assignedDogId]: { ...prev.forgeDogs[assignedDogId], assignedTo: null } } };
                                                            }
                                                            return { ...prev, dogs: { ...prev.dogs, globalSlots: newSlots, [assignedDogId]: { ...prev.dogs[assignedDogId], assignedTo: null } } };
                                                        });
                                                    }}>✖</button>
                                                )}
                                            </>
                                        ) : (
                                            <span className="global-dog-slot-plus">+</span>
                                        )}
                                    </div>
                                    {assignedDog && (
                                        <div className="global-slot-back">
                                            {renderPassiveBack(assignedDogId, assignedDog)}
                                        </div>
                                    )}
                                </div>

                                {isMenuOpen && !isRentedSlot && (
                                    <div className="global-dog-menu">
                                        {availableDogs.length === 0
                                            ? <span className="global-dog-menu-empty">Sin mascotas libres</span>
                                            : availableDogs.map(dog => (
                                                <button key={dog.id} className="global-dog-menu-option" onClick={e => {
                                                    e.stopPropagation();
                                                    const isForge = dog.id in ForgeDogsConfig;
                                                    setGameState(prev => {
                                                        const newSlots = (prev.dogs.globalSlots ?? [null, null, null]).map((id, idx) => idx === i ? dog.id : id);
                                                        if (isForge) {
                                                            return { ...prev, dogs: { ...prev.dogs, globalSlots: newSlots }, forgeDogs: { ...prev.forgeDogs, [dog.id]: { ...prev.forgeDogs[dog.id], assignedTo: { globalSlot: i } } } };
                                                        }
                                                        return { ...prev, dogs: { ...prev.dogs, globalSlots: newSlots, [dog.id]: { ...prev.dogs[dog.id], assignedTo: { globalSlot: i } } } };
                                                    });
                                                    setGlobalDogMenuOpen(null);
                                                }}>🐕 {DogsConfig[dog.id]?.name ?? ForgeDogsConfig[dog.id]?.name ?? dog.id}</button>
                                            ))
                                        }
                                        <button className="global-dog-menu-cancel" onClick={e => { e.stopPropagation(); setGlobalDogMenuOpen(null); setFlippedSlot(null); }}>✕</button>
                                    </div>
                                )}
                            </div>
                            {assignedDog && (
                                <span className="global-dog-slot-name">{DogsConfig[assignedDogId]?.name ?? ForgeDogsConfig[assignedDogId]?.name ?? assignedDogId}</span>
                            )}
                        </div>
                    );
                })}
            </div>

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
