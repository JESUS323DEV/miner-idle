import { RaidConfig, generateRaidLoot } from '../../config/RaidConfig.js';

// dogEntries: [{ id, isForge }]
const markDogs = (prevState, dogEntries, assignedTo) => {
    const updatedDogs = { ...prevState.dogs };
    const updatedForgeDogs = { ...prevState.forgeDogs };
    for (const { id, isForge } of dogEntries) {
        if (isForge) {
            if (updatedForgeDogs[id]) updatedForgeDogs[id] = { ...updatedForgeDogs[id], assignedTo };
        } else {
            if (updatedDogs[id]) updatedDogs[id] = { ...updatedDogs[id], assignedTo };
        }
    }
    return { updatedDogs, updatedForgeDogs };
};

export const useRaidActions = (gameState, setGameState) => {

    // ===== ENVIAR RAID PASIVA =====
    const handleSendPassiveRaid = (raidId, dogEntries) => {
        // dogEntries: [{ id, isForge }]
        setGameState(prevState => {
            const raid = RaidConfig.passiveRaids.find(r => r.id === raidId);
            if (!raid) return prevState;
            if (prevState.raid.passiveRaids.some(r => r.raidId === raidId)) return prevState;
            if (dogEntries.length < raid.minTeam || dogEntries.length > raid.maxTeam) return prevState;

            // Validar que todos los perros están disponibles
            for (const { id, isForge } of dogEntries) {
                const dog = isForge ? prevState.forgeDogs?.[id] : prevState.dogs?.[id];
                if (!dog || !dog.hired || dog.assignedTo) return prevState;
            }

            const { updatedDogs, updatedForgeDogs } = markDogs(prevState, dogEntries, { type: 'raid' });

            const now = Date.now();
            return {
                ...prevState,
                dogs: updatedDogs,
                forgeDogs: updatedForgeDogs,
                raid: {
                    ...prevState.raid,
                    passiveRaids: [
                        ...prevState.raid.passiveRaids,
                        {
                            raidId,
                            dogEntries,  // [{ id, isForge }]
                            startedAt: now,
                            returnAt: now + raid.duration * 1000,
                        },
                    ],
                },
            };
        });
    };

    // ===== RECLAMAR RAID PASIVA =====
    const handleClaimPassiveRaid = (raidId) => {
        setGameState(prevState => {
            const passive = prevState.raid.passiveRaids.find(r => r.raidId === raidId);
            if (!passive) return prevState;
            if (Date.now() < passive.returnAt) return prevState;

            const raid = RaidConfig.passiveRaids.find(r => r.id === raidId);
            if (!raid) return prevState;

            const dogEntries = passive.dogEntries ?? passive.dogIds?.map(id => ({ id, isForge: false })) ?? [];
            const dogIds = dogEntries.map(d => d.id);
            const loot = generateRaidLoot(raid, dogIds, prevState.dogs);

            // Liberar perros
            const { updatedDogs, updatedForgeDogs } = markDogs(prevState, dogEntries, null);

            // Aplicar fragmentos al estado correcto
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

            return {
                ...prevState,
                gold: prevState.gold + (loot.gold ?? 0),
                tavernCoins: prevState.tavernCoins + (loot.tavernCoins ?? 0),
                dogs: updatedDogs,
                forgeDogs: updatedForgeDogs,
                raid: {
                    ...prevState.raid,
                    passiveRaids: prevState.raid.passiveRaids.filter(r => r.raidId !== raidId),
                    lastRaidResults: {
                        ...prevState.raid.lastRaidResults,
                        [raidId]: { ...loot, claimedAt: Date.now() },
                    },
                },
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

    return {
        handleSendPassiveRaid,
        handleClaimPassiveRaid,
        handleCancelPassiveRaid,
    };
};
