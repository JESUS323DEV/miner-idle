import { useEffect } from 'react';
import { DogsConfig } from '../config/DogsConfig.js';
import { RentalConfig } from '../config/RentalConfig.js';
import { leavePJSlot } from '../utils/questUtils.js';

const getRentalDog = (currentDogs, currentActive, recentlyShown) => {
    const hiredIds = new Set(
        Object.values(currentDogs)
            .filter(d => d && typeof d === 'object' && !Array.isArray(d) && d.hired)
            .map(d => d.id)
    );
    const rentedIds = new Set((currentActive ?? []).map(r => r.dogId));
    const giftIds = new Set(['boxer', 'bully', 'chihuahua']);
    const recentIds = new Set(recentlyShown ?? []);

    const rand = Math.random() * 100;
    const rarity = rand < RentalConfig.rarityThresholds.legendary
        ? 'legendary'
        : rand < RentalConfig.rarityThresholds.epic
            ? 'epic'
            : 'rare';

    const eligible = (d) => !hiredIds.has(d.id) && !rentedIds.has(d.id) && !giftIds.has(d.id);

    let pool = Object.values(DogsConfig).filter(d => d.rarity === rarity && eligible(d) && !recentIds.has(d.id));
    if (pool.length === 0) pool = Object.values(DogsConfig).filter(d => eligible(d) && !recentIds.has(d.id));
    // Si todos ya han salido recientemente, resetear historial y volver a intentar
    if (pool.length === 0) pool = Object.values(DogsConfig).filter(d => d.rarity === rarity && eligible(d));
    if (pool.length === 0) pool = Object.values(DogsConfig).filter(d => eligible(d));
    if (pool.length === 0) return null;

    const dog = pool[Math.floor(Math.random() * pool.length)];
    return { dogId: dog.id, rarity: dog.rarity, cost: RentalConfig.costs[dog.rarity] };
};

export const useRentalTimer = (setGameState) => {
    useEffect(() => {
        const t = setInterval(() => {
            setGameState(prev => {
                const rental = prev.rental;
                if (!rental) return prev;

                let changed = false;
                let available = rental.available;
                let appearanceRemainingMs = rental.appearanceRemainingMs;
                const newSlots = [...(prev.dogs?.globalSlots ?? [null, null, null])];
                let slotsChanged = false;

                let recentlyShown = rental.recentlyShown ?? [];
                if (!available) {
                    const newMs = Math.max(0, appearanceRemainingMs - 1000);
                    if (newMs !== appearanceRemainingMs) {
                        changed = true;
                        if (newMs <= 0) {
                            const generated = getRentalDog(prev.dogs ?? {}, rental.active, recentlyShown);
                            if (generated) {
                                available = generated;
                                appearanceRemainingMs = 0;
                                const allEligible = Object.values(DogsConfig)
                                    .filter(d => !['boxer','bully','chihuahua'].includes(d.id))
                                    .map(d => d.id);
                                const next = [...recentlyShown, generated.dogId];
                                recentlyShown = next.length >= allEligible.length ? [] : next;
                            } else {
                                appearanceRemainingMs = 60 * 1000;
                            }
                        } else {
                            appearanceRemainingMs = newMs;
                        }
                    }
                }

                let pjQuests = prev.pjQuests ?? {};
                let pjChanged = false;
                const newActive = [];
                for (const r of (rental.active ?? [])) {
                    const newMs = Math.max(0, r.remainingMs - 1000);
                    if (newMs <= 0) {
                        changed = true;
                        if (r.destination !== 'raid' && r.assignedSlot !== null && newSlots[r.assignedSlot] === r.dogId) {
                            newSlots[r.assignedSlot] = null;
                            slotsChanged = true;
                            const updated = leavePJSlot(pjQuests, r.dogId);
                            if (updated !== pjQuests) { pjQuests = updated; pjChanged = true; }
                        }
                    } else {
                        if (newMs !== r.remainingMs) changed = true;
                        newActive.push({ ...r, remainingMs: newMs });
                    }
                }

                if (!changed) return prev;

                return {
                    ...prev,
                    rental: { available, active: newActive, appearanceRemainingMs, recentlyShown },
                    dogs: slotsChanged ? { ...prev.dogs, globalSlots: newSlots } : prev.dogs,
                    pjQuests: pjChanged ? pjQuests : prev.pjQuests,
                };
            });
        }, 1000);
        return () => clearInterval(t);
    }, []);
};
