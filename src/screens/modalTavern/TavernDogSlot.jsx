import { useState } from 'react';
import { X } from 'lucide-react';
import { DogsConfig } from '../../game/config/DogsConfig.js';
import { ForgeDogsConfig } from '../../game/config/ForgeDogsConfig.js';
import { dogAssets } from '../../game/utils/dogAssets.js';

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

export default function TavernDogSlot({ gameState, setGameState }) {
    const [open, setOpen] = useState(false);

    const tavernDogId = gameState.tavernDogSlot ?? null;
    const tavernDog = tavernDogId
        ? (gameState.dogs?.[tavernDogId] ?? gameState.forgeDogs?.[tavernDogId] ?? null)
        : null;
    const tavernRarity = tavernDogId
        ? (DogsConfig[tavernDogId]?.rarity ?? ForgeDogsConfig[tavernDogId]?.rarity ?? null)
        : null;

    const getDogPool = () => {
        const pool = [];
        Object.entries(gameState.dogs ?? {}).forEach(([id, dog]) => {
            if (id === 'globalSlots' || !dog || typeof dog !== 'object' || !dog.hired) return;
            pool.push({ id, dog, cfg: DogsConfig[id], status: getDogStatus(dog, false), isForge: false });
        });
        Object.entries(gameState.forgeDogs ?? {}).forEach(([id, dog]) => {
            if (!dog || typeof dog !== 'object' || !dog.hired) return;
            pool.push({ id, dog, cfg: ForgeDogsConfig[id], status: getDogStatus(dog, true), isForge: true });
        });
        const order = { legendary: 0, epic: 1, rare: 2 };
        pool.sort((a, b) => (order[a.cfg?.rarity] ?? 9) - (order[b.cfg?.rarity] ?? 9));
        return pool;
    };

    const assignDog = (dogId, isForge) => {
        setGameState(prev => {
            const prevId = prev.tavernDogSlot;
            let next = { ...prev, tavernDogSlot: dogId };

            if (prevId && prevId !== dogId) {
                const prevIsForge = prevId in ForgeDogsConfig;
                if (prevIsForge) {
                    next = { ...next, forgeDogs: { ...next.forgeDogs, [prevId]: { ...next.forgeDogs[prevId], assignedTo: null } } };
                } else {
                    next = { ...next, dogs: { ...next.dogs, [prevId]: { ...next.dogs[prevId], assignedTo: null } } };
                }
            }

            if (isForge) {
                next = { ...next, forgeDogs: { ...next.forgeDogs, [dogId]: { ...next.forgeDogs[dogId], assignedTo: { tavern: true } } } };
            } else {
                next = { ...next, dogs: { ...next.dogs, [dogId]: { ...next.dogs[dogId], assignedTo: { tavern: true } } } };
            }

            return next;
        });
        setOpen(false);
    };

    const unassign = () => {
        setGameState(prev => {
            const prevId = prev.tavernDogSlot;
            if (!prevId) return prev;
            const prevIsForge = prevId in ForgeDogsConfig;
            let next = { ...prev, tavernDogSlot: null };
            if (prevIsForge) {
                next = { ...next, forgeDogs: { ...next.forgeDogs, [prevId]: { ...next.forgeDogs[prevId], assignedTo: null } } };
            } else {
                next = { ...next, dogs: { ...next.dogs, [prevId]: { ...next.dogs[prevId], assignedTo: null } } };
            }
            return next;
        });
    };

    return (
        <div className="tavern-dog-slot-wrap" onClick={e => e.stopPropagation()}>
            <div
                className={`global-dog-slot${tavernRarity ? ` dog-rarity-${tavernRarity}` : ''}`}
                onClick={() => setOpen(p => !p)}
            >
                {tavernDog
                    ? <img src={dogAssets[tavernDogId]} className="global-dog-slot-img" alt={tavernDogId} />
                    : <span className="global-dog-slot-plus">+</span>
                }
            </div>
            {tavernDog && (
                <button className="gds-slot-unassign" onClick={e => { e.stopPropagation(); unassign(); }}>
                    <X size={9} />
                </button>
            )}

            {open && (
                <div className="tavern-dog-panel">
                    {getDogPool().length === 0 && (
                        <span className="tavern-dog-panel-empty">Sin mascotas</span>
                    )}
                    {getDogPool().map(({ id, dog, cfg, status, isForge }) => {
                        const unavailable = status !== 'available' && status !== 'inTavern';
                        const isAssigned = id === tavernDogId;
                        return (
                            <div
                                key={id}
                                className={`tavern-dog-panel-item dog-rarity-${cfg?.rarity}${unavailable ? ' unavailable' : ''}${isAssigned ? ' assigned' : ''}`}
                                onClick={() => { if (!unavailable) assignDog(id, isForge); }}
                            >
                                <img src={dogAssets[id]} className="tavern-dog-panel-img" alt={id} />
                                <span className="tavern-dog-panel-name">{cfg?.name ?? id}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
