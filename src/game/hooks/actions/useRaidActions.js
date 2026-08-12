import { RaidConfig, generateRaidLoot } from '../../config/RaidConfig.js';
import { DogsConfig } from '../../config/DogsConfig.js';
import { ForgeDogsConfig } from '../../config/ForgeDogsConfig.js';
import { TavernConfig } from '../../config/TavernConfig.js';
import { advanceDailyQuestInState, leavePJSlot, advancePJRaids } from '../../utils/questUtils.js';

const RARITY_RANK = { common: 0, rare: 1, epic: 2, legendary: 3 };

const teamMeetsMinRarity = (dogEntries, dogsState, forgeDogs, minRarity) => {
    if (!minRarity) return true;
    const minRank = RARITY_RANK[minRarity] ?? 0;
    return dogEntries.some(({ id, isForge }) => {
        const cfg = isForge ? ForgeDogsConfig[id] : DogsConfig[id];
        return (RARITY_RANK[cfg?.rarity] ?? 0) >= minRank;
    });
};

// dogEntries: [{ id, isForge }]
const markDogs = (prevState, dogEntries, assignedTo) => {
    const updatedDogs = { ...prevState.dogs };
    const updatedForgeDogs = { ...prevState.forgeDogs };
    const globalSlots = [...(prevState.dogs.globalSlots ?? [null, null, null])];

    for (const { id, isForge } of dogEntries) {
        if (isForge) {
            if (updatedForgeDogs[id]) {
                if (updatedForgeDogs[id].assignedTo?.globalSlot !== undefined)
                    globalSlots[updatedForgeDogs[id].assignedTo.globalSlot] = null;
                updatedForgeDogs[id] = { ...updatedForgeDogs[id], assignedTo };
            }
        } else {
            if (updatedDogs[id]) {
                if (updatedDogs[id].assignedTo?.globalSlot !== undefined)
                    globalSlots[updatedDogs[id].assignedTo.globalSlot] = null;
                updatedDogs[id] = { ...updatedDogs[id], assignedTo };
            }
        }
    }

    updatedDogs.globalSlots = globalSlots;
    return { updatedDogs, updatedForgeDogs };
};

export const useRaidActions = (gameState, setGameState) => {

    // ===== ENVIAR RAID PASIVA =====
    const handleSendPassiveRaid = (raidId, dogEntries, durationOverride = null) => {
        // dogEntries: [{ id, isForge }]
        setGameState(prevState => {
            const raid = RaidConfig.passiveRaids.find(r => r.id === raidId);
            if (!raid) return prevState;
            if (prevState.raid.passiveRaids.some(r => r.raidId === raidId)) return prevState;
            if (dogEntries.length < raid.minTeam || dogEntries.length > raid.maxTeam) return prevState;
            if (!teamMeetsMinRarity(dogEntries, prevState.dogs, prevState.forgeDogs, raid.minRarity)) return prevState;

            // Validar que todos los perros están disponibles
            for (const { id, isForge, isRented } of dogEntries) {
                if (isRented) continue;
                const dog = isForge ? prevState.forgeDogs?.[id] : prevState.dogs?.[id];
                if (!dog || !dog.hired) return prevState;
                // Bloquear si está en yacimiento o en otra raid, pero permitir slot global
                if (dog.assignedTo && dog.assignedTo.globalSlot === undefined) return prevState;
            }

            const { updatedDogs, updatedForgeDogs } = markDogs(prevState, dogEntries, { type: 'raid' });

            let pjQuests = prevState.pjQuests ?? {};
            for (const { id, isForge } of dogEntries) {
                if (isForge) continue;
                if (prevState.dogs?.[id]?.assignedTo?.globalSlot !== undefined) pjQuests = leavePJSlot(pjQuests, id);
                pjQuests = advancePJRaids(pjQuests, id);
            }

            const now = Date.now();
            let dq = advanceDailyQuestInState(prevState.dailyQuests, 'passiveSent', 1);
            if (dogEntries.length >= 3) dq = advanceDailyQuestInState(dq, 'passiveTeam3', 1);
            return {
                ...prevState,
                dogs: updatedDogs,
                forgeDogs: updatedForgeDogs,
                totalPassiveRaids: (prevState.totalPassiveRaids ?? 0) + 1,
                raid: {
                    ...prevState.raid,
                    passiveRaids: [
                        ...prevState.raid.passiveRaids,
                        {
                            raidId,
                            dogEntries,
                            startedAt: now,
                            returnAt: now + (durationOverride ?? raid.duration) * 1000,
                        },
                    ],
                },
                dailyQuests: dq,
                pjQuests,
            };
        });
    };

    // ===== RECLAMAR RAID PASIVA =====
    const handleClaimPassiveRaid = (raidId, onLoot) => {
        const passive = gameState.raid.passiveRaids.find(r => r.raidId === raidId);
        if (!passive || Date.now() < passive.returnAt) return;

        const raid = RaidConfig.passiveRaids.find(r => r.id === raidId);
        if (!raid) return;

        const dogEntries = passive.dogEntries ?? passive.dogIds?.map(id => ({ id, isForge: false })) ?? [];
        const dogIds = dogEntries.map(d => d.id);
        const loot = generateRaidLoot(raid, dogIds, gameState.dogs);

        onLoot?.(loot, raid);

        setGameState(prevState => {
            const { updatedDogs, updatedForgeDogs } = markDogs(prevState, dogEntries, null);

            if (loot.fragments) {
                for (const { dogId, amount } of loot.fragments) {
                    const entry = dogEntries.find(d => d.id === dogId);
                    if (entry?.isForge) {
                        if (updatedForgeDogs[dogId]) {
                            updatedForgeDogs[dogId] = {
                                ...updatedForgeDogs[dogId],
                                fragments: (updatedForgeDogs[dogId].fragments ?? 0) + amount,
                            };
                        }
                    } else {
                        if (updatedDogs[dogId]) {
                            updatedDogs[dogId] = {
                                ...updatedDogs[dogId],
                                fragments: (updatedDogs[dogId].fragments ?? 0) + amount,
                            };
                        }
                    }
                }
            }

            let dq = advanceDailyQuestInState(prevState.dailyQuests, 'passiveClaimed', 1);
            if (loot.fragments?.length) dq = advanceDailyQuestInState(dq, 'passiveShards', 1);
            if ((RARITY_RANK[raid.minRarity] ?? 0) >= RARITY_RANK['epic']) dq = advanceDailyQuestInState(dq, 'passiveEpic', 1);
            return {
                ...prevState,
                gold: prevState.gold + (loot.gold ?? 0),
                tavernCoins: prevState.tavernCoins + (loot.tavernCoins ?? 0),
                huesin: prevState.huesin + (loot.huesin ?? 0),
                dogs: updatedDogs,
                forgeDogs: updatedForgeDogs,
                raid: {
                    ...prevState.raid,
                    passiveRaids: prevState.raid.passiveRaids.filter(r => r.raidId !== raidId),
                },
                dailyQuests: dq,
            };
        });
    };

    // ===== CANCELAR RAID (sin loot) =====
    const handleCancelPassiveRaid = (raidId) => {
        setGameState(prevState => {
            const passive = prevState.raid.passiveRaids.find(r => r.raidId === raidId);
            if (!passive) return prevState;

            const dogEntries = passive.dogEntries ?? passive.dogIds?.map(id => ({ id, isForge: false })) ?? [];
            const { updatedDogs, updatedForgeDogs } = markDogs(prevState, dogEntries, null);

            return {
                ...prevState,
                dogs: updatedDogs,
                forgeDogs: updatedForgeDogs,
                raid: {
                    ...prevState.raid,
                    passiveRaids: prevState.raid.passiveRaids.filter(r => r.raidId !== raidId),
                },
            };
        });
    };

    const handleUnlockRaidActivas = () => {
        setGameState(prev => {
            if (prev.gold < 25000 || prev.raidActivasUnlocked) return prev;
            return { ...prev, gold: prev.gold - 25000, raidActivasUnlocked: true };
        });
    };

    // ===== ENVIAR PEDIDO (tablón de envíos: trigo/lupulo) =====
    const handleSendOrder = (material, dogId, isForge, times = 1, autoResend = false) => {
        setGameState(prevState => {
            if (prevState.raidOrders?.[material]) return prevState;

            const prov = TavernConfig.provisions.find(p => p.id === material);
            if (!prov) return prevState;

            const dog = isForge ? prevState.forgeDogs?.[dogId] : prevState.dogs?.[dogId];
            if (!dog || !dog.hired) return prevState;
            if (dog.assignedTo && dog.assignedTo.globalSlot === undefined) return prevState;

            const realTimes = autoResend ? 1 : times;
            const total = prov.costPerUnit * prov.buyAmount * realTimes;
            if (prevState.gold < total) return prevState;

            const cfg = isForge ? ForgeDogsConfig[dogId] : DogsConfig[dogId];
            const stars = dog.stars ?? 0;
            const mult = 1 + (cfg?.starBonus ?? 0) * stars;
            const duration = TavernConfig.orders.duration / mult;

            const { updatedDogs, updatedForgeDogs } = markDogs(prevState, [{ id: dogId, isForge }], { type: 'order', material });

            const now = Date.now();
            return {
                ...prevState,
                gold: prevState.gold - total,
                totalGoldSpent: (prevState.totalGoldSpent ?? 0) + total,
                dogs: updatedDogs,
                forgeDogs: updatedForgeDogs,
                raidOrders: {
                    ...prevState.raidOrders,
                    [material]: {
                        dogId,
                        isForge,
                        startedAt: now,
                        returnAt: now + duration * 1000,
                        amount: prov.buyAmount * realTimes,
                        autoResend,
                        autoResendUntil: autoResend ? now + TavernConfig.orders.autoResendWindow * 1000 : null,
                    },
                },
            };
        });
    };

    // ===== RECLAMAR PEDIDO =====
    const handleClaimOrder = (material) => {
        setGameState(prevState => {
            const order = prevState.raidOrders?.[material];
            if (!order || Date.now() < order.returnAt) return prevState;

            const { updatedDogs, updatedForgeDogs } = markDogs(prevState, [{ id: order.dogId, isForge: order.isForge }], null);

            const max = prevState.tavernProvisionMaxStock ?? TavernConfig.provisionsMaxStock;
            const current = prevState.tavernStock?.[material] ?? 0;

            return {
                ...prevState,
                dogs: updatedDogs,
                forgeDogs: updatedForgeDogs,
                tavernStock: { ...prevState.tavernStock, [material]: Math.min(max, current + order.amount) },
                raidOrders: { ...prevState.raidOrders, [material]: null },
            };
        });
    };

    return {
        handleSendPassiveRaid,
        handleClaimPassiveRaid,
        handleCancelPassiveRaid,
        handleUnlockRaidActivas,
        handleSendOrder,
        handleClaimOrder,
    };
};
