import { useState } from 'react';
import { DogsConfig } from '../game/config/DogsConfig.js';
import { ForgeDogsConfig } from '../game/config/ForgeDogsConfig.js';
import { getDogStats } from '../game/utils/getDogStats.js';
import { dogAssets } from '../game/utils/dogAssets.js';
import { formatRentalTimer } from '../game/utils/formatters.js';

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

export default function GlobalDogSlots({ gameState, setGameState, tutorialStep }) {
    const [globalDogMenuOpen, setGlobalDogMenuOpen] = useState(null);
    const [flippedSlot, setFlippedSlot] = useState(null);

    return (
        <div className="global-dog-slots" style={tutorialStep === 'hint_mine_dog' ? { zIndex: 600 } : undefined}>
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
                    <div key={i} className={`global-dog-slot-wrapper${isRentedSlot ? ' global-dog-slot-rented' : ''}${isZeusTutorialSlot ? ' tutorial-highlight' : ''}`}>
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
    );
}
