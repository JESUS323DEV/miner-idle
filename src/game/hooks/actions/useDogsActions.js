import { DogsConfig } from '../../config/DogsConfig.js';
import { ForgeDogsConfig } from '../../config/ForgeDogsConfig.js';
import { ForgeConfig } from '../../config/ForgeConfig.js';
import { PACK_TYPES, FRAGMENTS_PER_RARITY, FREE_FRAGMENTS_PER_RARITY } from '../../config/GachaConfig.js';
import { getDogStats } from '../../utils/getDogStats.js';

export const useDogsActions = (gameState, setGameState) => {

    // ========== CONTRATAR PERRO MINERO ==========
    const handleHireDog = (dogId) => {
        setGameState(prevState => {
            const dog = prevState.dogs[dogId];
            if (!dog || dog.hired) return prevState;

            const cost = DogsConfig[dogId].unlockCost;
            if (prevState.gold < cost.gold) return prevState;
            if (prevState.tavernCoins < cost.tavernCoins) return prevState;

            const globalSlots = prevState.dogs.globalSlots ?? [null, null, null];
            const emptyIdx = globalSlots.findIndex(id => id === null);
            const newSlots = emptyIdx !== -1 ? globalSlots.map((id, i) => i === emptyIdx ? dogId : id) : globalSlots;
            const assignedTo = emptyIdx !== -1 ? { globalSlot: emptyIdx } : null;

            return {
                ...prevState,
                gold: prevState.gold - cost.gold,
                tavernCoins: prevState.tavernCoins - cost.tavernCoins,
                dogs: {
                    ...prevState.dogs,
                    globalSlots: newSlots,
                    [dogId]: { ...dog, hired: true, assignedTo }
                }
            };
        });
    };

    // ========== ASIGNAR PERRO A YACIMIENTO ==========
    const handleAssignDog = (dogId, biome, slotId) => {
        setGameState(prevState => {
            const dog = prevState.dogs[dogId];
            if (!dog || !dog.hired) return prevState;
            if (dog.assignedTo !== null) return prevState;

            const slot = prevState.yacimientos[biome].slots.find(s => s.id === slotId);
            if (!slot || !slot.unlocked) return prevState;

            const slotTaken = Object.values(prevState.dogs).some(
                d => d && typeof d === 'object' && d.assignedTo?.biome === biome && d.assignedTo?.slotId === slotId
            );
            if (slotTaken) return prevState;

            const now = Date.now();
            const SESSION_DURATION_MS = 10 * 60 * 1000;
            const existingSession = slot.session;

            // Si hay cooldown activo aún, el perro entra pero el cooldown sigue
            // Si el cooldown ya expiró o no hay sesión, arranca a minar
            let newSession;
            if (existingSession?.phase === 'cooldown' && now < existingSession.endsAt) {
                newSession = existingSession; // cooldown sigue en el slot
            } else {
                newSession = { phase: 'mining', startedAt: now, endsAt: now + SESSION_DURATION_MS, lastTick: null };
            }

            return {
                ...prevState,
                dogs: {
                    ...prevState.dogs,
                    [dogId]: { ...dog, assignedTo: { biome, slotId } }
                },
                yacimientos: {
                    ...prevState.yacimientos,
                    [biome]: {
                        ...prevState.yacimientos[biome],
                        slots: prevState.yacimientos[biome].slots.map(s =>
                            s.id === slotId ? { ...s, session: newSession } : s
                        )
                    }
                }
            };
        });
    };

    // ========== DESASIGNAR PERRO ==========
    const handleUnassignDog = (dogId) => {
        setGameState(prevState => {
            const dog = prevState.dogs[dogId];
            if (!dog || dog.assignedTo === null) return prevState;

            const { biome, slotId } = dog.assignedTo;
            const slot = prevState.yacimientos[biome]?.slots?.find(s => s.id === slotId);

            // Bloqueado durante minado activo; en cooldown se puede sacar
            if (slot?.session?.phase === 'mining') return prevState;

            return {
                ...prevState,
                dogs: {
                    ...prevState.dogs,
                    [dogId]: { ...dog, assignedTo: null }
                },
                // El slot conserva su sesión de cooldown aunque no haya perro
            };
        });
    };

    // ========== TICK AUTOMÁTICO DE PERRO ==========
    const handleDogTick = (dogId) => {
        setGameState(prevState => {
            const dog = prevState.dogs[dogId];
            if (!dog || !dog.hired || !dog.assignedTo) return prevState;
            if (dog.assignedTo.globalSlot !== undefined) return prevState;

            if (dog.assignedTo.mineComp !== undefined) {
                const biome = dog.assignedTo.mineComp;
                const dogConfig = DogsConfig[dogId];
                const starMult = 1 + (dogConfig?.starBonus ?? 0) * (dog.stars ?? 0);
                const baseYield = dogConfig?.yacimientoYield ?? 1;
                const biomeBonusRaw = dogConfig?.biomeBonus?.[biome] ?? 1.0;
                const biomeMult = Array.isArray(biomeBonusRaw) ? (biomeBonusRaw[Math.min(5, dog.stars ?? 0)] ?? 1.0) : biomeBonusRaw;
                const materialGained = Math.round(baseYield * biomeMult * starMult);
                return {
                    ...prevState,
                    [biome]: (prevState[biome] ?? 0) + materialGained,
                    ...(biome === 'bronze'  ? { totalBronzeMined:  (prevState.totalBronzeMined  ?? 0) + materialGained } : {}),
                    ...(biome === 'iron'    ? { totalIronMined:    (prevState.totalIronMined    ?? 0) + materialGained } : {}),
                    ...(biome === 'diamond' ? { totalDiamondMined: (prevState.totalDiamondMined ?? 0) + materialGained } : {}),
                    dogs: {
                        ...prevState.dogs,
                        [dogId]: { ...dog, mineCompLastTick: Date.now() },
                    },
                };
            }

            const { biome, slotId } = dog.assignedTo;
            const slot = prevState.yacimientos[biome]?.slots?.find(s => s.id === slotId);
            if (!slot?.unlocked) return prevState;

            const now = Date.now();
            const SESSION_DURATION_MS = 10 * 60 * 1000;
            const COOLDOWN_DURATION_MS = 3 * 60 * 1000;

            // Auto-start si hay perro asignado pero sin sesión
            if (!slot.session) {
                return {
                    ...prevState,
                    yacimientos: {
                        ...prevState.yacimientos,
                        [biome]: {
                            ...prevState.yacimientos[biome],
                            slots: prevState.yacimientos[biome].slots.map(s =>
                                s.id === slotId
                                    ? { ...s, session: { phase: 'mining', startedAt: now, endsAt: now + SESSION_DURATION_MS, lastTick: null } }
                                    : s
                            )
                        }
                    }
                };
            }

            const { phase, endsAt } = slot.session;

            if (phase === 'mining') {
                if (now >= endsAt) {
                    return {
                        ...prevState,
                        yacimientos: {
                            ...prevState.yacimientos,
                            [biome]: {
                                ...prevState.yacimientos[biome],
                                slots: prevState.yacimientos[biome].slots.map(s =>
                                    s.id === slotId
                                        ? { ...s, session: { phase: 'cooldown', startedAt: now, endsAt: now + COOLDOWN_DURATION_MS, lastTick: null } }
                                        : s
                                )
                            }
                        }
                    };
                }

                const dogConfig = DogsConfig[dogId];
                const starMult = 1 + (dogConfig?.starBonus ?? 0) * (dog.stars ?? 0);
                const baseYield = dogConfig?.yacimientoYield ?? 1;
                const biomeBonusRaw2 = dogConfig?.biomeBonus?.[biome] ?? 1.0;
                const biomeMult = Array.isArray(biomeBonusRaw2) ? (biomeBonusRaw2[Math.min(5, dog.stars ?? 0)] ?? 1.0) : biomeBonusRaw2;
                const materialGained = Math.round(baseYield * biomeMult * starMult);

                return {
                    ...prevState,
                    [biome]: (prevState[biome] ?? 0) + materialGained,
                    ...(biome === 'bronze'  ? { totalBronzeMined:  (prevState.totalBronzeMined  ?? 0) + materialGained } : {}),
                    ...(biome === 'iron'    ? { totalIronMined:    (prevState.totalIronMined    ?? 0) + materialGained } : {}),
                    ...(biome === 'diamond' ? { totalDiamondMined: (prevState.totalDiamondMined ?? 0) + materialGained } : {}),
                    yacimientos: {
                        ...prevState.yacimientos,
                        [biome]: {
                            ...prevState.yacimientos[biome],
                            slots: prevState.yacimientos[biome].slots.map(s =>
                                s.id === slotId
                                    ? { ...s, session: { ...s.session, lastTick: now } }
                                    : s
                            )
                        }
                    }
                };
            }

            if (phase === 'cooldown') {
                if (now >= endsAt) {
                    return {
                        ...prevState,
                        yacimientos: {
                            ...prevState.yacimientos,
                            [biome]: {
                                ...prevState.yacimientos[biome],
                                slots: prevState.yacimientos[biome].slots.map(s =>
                                    s.id === slotId
                                        ? { ...s, session: { phase: 'mining', startedAt: now, endsAt: now + SESSION_DURATION_MS, lastTick: null } }
                                        : s
                                )
                            }
                        }
                    };
                }
                return prevState;
            }

            return prevState;
        });
    };

    // ========== CONTRATAR PERRO DE FORJA ==========
    const handleHireForgeDog = (dogId) => {
        setGameState(prevState => {
            const dog = prevState.forgeDogs[dogId];
            if (!dog || dog.hired) return prevState;

            const cost = ForgeDogsConfig[dogId].unlockCost;
            if (prevState.gold < cost.gold) return prevState;
            if (prevState.tavernCoins < cost.tavernCoins) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - cost.gold,
                tavernCoins: prevState.tavernCoins - cost.tavernCoins,
                forgeDogs: {
                    ...prevState.forgeDogs,
                    [dogId]: { ...dog, hired: true }
                }
            };
        });
    };

    // ========== ASIGNAR PERRO DE FORJA A HORNO ==========
    const handleAssignForgeDog = (dogId, material) => {
        setGameState(prevState => {
            const dog = prevState.forgeDogs[dogId];
            if (!dog || !dog.hired) return prevState;
            if (dog.assignedTo !== null) return prevState;

            const slotTaken = Object.values(prevState.forgeDogs).some(
                d => d && typeof d === 'object' && d.assignedTo === material
            );
            if (slotTaken) return prevState;

            const furnace = prevState.furnaces[material];
            const dogConfig = ForgeDogsConfig[dogId];
            let newCurrentDuration = null;

            if (furnace.isActive) {
                const baseTime = ForgeConfig.furnaces[material].levels[furnace.level];
                const timeReduction = (dogConfig.forgeBonus.timeReduction || 0) + (dogConfig.forgeBonus.biomeBonus[material] || 0);
                newCurrentDuration = Math.max(1, baseTime - timeReduction);
            }

            return {
                ...prevState,
                forgeDogs: {
                    ...prevState.forgeDogs,
                    [dogId]: { ...dog, assignedTo: material }
                },
                furnaces: {
                    ...prevState.furnaces,
                    [material]: {
                        ...furnace,
                        currentDuration: newCurrentDuration
                    }
                }
            };
        });
    };

    // ========== DESASIGNAR PERRO DE FORJA ==========
    const handleUnassignForgeDog = (dogId) => {
        setGameState(prevState => {
            const dog = prevState.forgeDogs[dogId];
            if (!dog || dog.assignedTo === null) return prevState;

            const material = dog.assignedTo;

            return {
                ...prevState,
                forgeDogs: {
                    ...prevState.forgeDogs,
                    [dogId]: { ...dog, assignedTo: null }
                },
                furnaces: {
                    ...prevState.furnaces,
                    [material]: {
                        ...prevState.furnaces[material],
                        currentDuration: null
                    }
                }
            };
        });
    };

    // ========== DESBLOQUEAR CON FRAGMENTOS ==========
    const handleUnlockWithFragments = (dogId, isForge = false) => {
        setGameState(prevState => {
            const stateKey = isForge ? 'forgeDogs' : 'dogs';
            const config = isForge ? ForgeDogsConfig[dogId] : DogsConfig[dogId];
            const dog = prevState[stateKey][dogId];
            if (!dog || dog.hired) return prevState;
            if ((dog.fragments ?? 0) < config.unlockFragments) return prevState;

            const { gold: goldCost = 0, tavernCoins: coinCost = 0 } = config.unlockCost ?? {};
            if (prevState.gold < goldCost) return prevState;
            if (prevState.tavernCoins < coinCost) return prevState;

            let extraDogState = {};
            if (!isForge) {
                const globalSlots = prevState.dogs.globalSlots ?? [null, null, null];
                const emptyIdx = globalSlots.findIndex(id => id === null);
                if (emptyIdx !== -1) {
                    extraDogState = { globalSlots: globalSlots.map((id, i) => i === emptyIdx ? dogId : id) };
                }
            }
            const assignedTo = !isForge && (() => {
                const globalSlots = prevState.dogs.globalSlots ?? [null, null, null];
                const emptyIdx = globalSlots.findIndex(id => id === null);
                return emptyIdx !== -1 ? { globalSlot: emptyIdx } : null;
            })();

            return {
                ...prevState,
                gold: prevState.gold - goldCost,
                tavernCoins: prevState.tavernCoins - coinCost,
                [stateKey]: {
                    ...prevState[stateKey],
                    ...extraDogState,
                    [dogId]: { ...dog, hired: true, stars: 0, fragments: dog.fragments - config.unlockFragments, assignedTo: isForge ? null : assignedTo }
                }
            };
        });
    };

    // ========== SUBIR ESTRELLA ==========
    const STAR_GOLD_BASE = { rare: 5000, epic: 10000, legendary: 15000 };
    const STAR_COIN_BASE = { rare: 1, epic: 2, legendary: 3 };

    const handleUpgradeStar = (dogId, isForge = false) => {
        setGameState(prevState => {
            const stateKey = isForge ? 'forgeDogs' : 'dogs';
            const config = isForge ? ForgeDogsConfig[dogId] : DogsConfig[dogId];
            const dog = prevState[stateKey][dogId];
            if (!dog || !dog.hired) return prevState;
            const stars = dog.stars ?? 0;
            if (stars >= 5) return prevState;
            const needed = config.starFragments[stars];
            if ((dog.fragments ?? 0) < needed) return prevState;
            const goldCost = (STAR_GOLD_BASE[config.rarity] ?? 0) + stars * 5000;
            const coinCost = (STAR_COIN_BASE[config.rarity] ?? 0) + stars;
            if (prevState.gold < goldCost) return prevState;
            if (prevState.tavernCoins < coinCost) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - goldCost,
                tavernCoins: prevState.tavernCoins - coinCost,
                [stateKey]: {
                    ...prevState[stateKey],
                    [dogId]: { ...dog, stars: stars + 1, fragments: dog.fragments - needed }
                }
            };
        });
    };

    // ========== ABRIR SOBRE (GACHA) ==========
    const handleOpenPack = (packId, isForge = false) => {
        setGameState(prevState => {
            const pack = PACK_TYPES[packId];
            if (prevState.tavernCoins < pack.cost) return prevState;

            // Pity counters: guardados en prevState.gachaPity
            const pityKey = `${isForge ? 'forge' : 'miner'}_${packId}`;
            const pity = prevState.gachaPity?.[pityKey] ?? { count: 0, epicCount: 0 };
            let newCount = pity.count + 1;
            let newEpicCount = pity.epicCount + 1;

            // Determinar rareza
            let rarity;
            const packPity = pack.pity;
            if (packPity.legendary && newCount >= packPity.legendary) {
                rarity = 'legendary';
            } else if (packPity.epic && newEpicCount >= packPity.epic) {
                rarity = 'epic';
            } else {
                const roll = Math.random();
                if (roll < pack.rates.legendary) rarity = 'legendary';
                else if (roll < pack.rates.legendary + pack.rates.epic) rarity = 'epic';
                else rarity = 'rare';
            }

            // Resetear pity según rareza
            if (rarity === 'legendary') { newCount = 0; newEpicCount = 0; }
            else if (rarity === 'epic') { newEpicCount = 0; }

            // Elegir perro random de esa rareza
            const stateKey = isForge ? 'forgeDogs' : 'dogs';
            const configMap = isForge ? ForgeDogsConfig : DogsConfig;
            const pool = Object.keys(configMap).filter(id => configMap[id].rarity === rarity);
            if (pool.length === 0) { console.error('[Gacha] pool vacío para rareza:', rarity); return prevState; }

            const pickedId = pool[Math.floor(Math.random() * pool.length)];
            const fragsGained = FRAGMENTS_PER_RARITY[rarity];

            const currentDog = prevState[stateKey]?.[pickedId];
            if (!currentDog) { console.error('[Gacha] perro no encontrado:', pickedId, 'en', stateKey, prevState[stateKey]); return prevState; }
            const updatedDog = { ...currentDog, fragments: (currentDog.fragments ?? 0) + fragsGained };

            return {
                ...prevState,
                tavernCoins: prevState.tavernCoins - pack.cost,
                [stateKey]: { ...prevState[stateKey], [pickedId]: updatedDog },
                gachaPity: {
                    ...prevState.gachaPity,
                    [pityKey]: { count: newCount, epicCount: newEpicCount }
                },
                totalSummons: (prevState.totalSummons ?? 0) + 1,
                lastPackResult: { dogId: pickedId, rarity, fragments: fragsGained, isForge }
            };
        });
    };

    const FREE_PULL_COOLDOWNS = { basic: 5 * 3600000, epic: 10 * 3600000, legendary: 24 * 3600000 };

    const handleFreePull = (packId, isForge = false) => {
        setGameState(prevState => {
            const cooldown = FREE_PULL_COOLDOWNS[packId];
            const pullKey = `${isForge ? 'forge' : 'miner'}_${packId}`;
            const last = prevState.lastFreePull?.[pullKey] ?? 0;
            if (Date.now() - last < cooldown) return prevState;

            const pack = PACK_TYPES[packId];
            const pityKey = `${isForge ? 'forge' : 'miner'}_${packId}`;
            const pity = prevState.gachaPity?.[pityKey] ?? { count: 0, epicCount: 0 };
            let newCount = pity.count + 1;
            let newEpicCount = pity.epicCount + 1;

            let rarity;
            const packPity = pack.pity;
            if (packPity.legendary && newCount >= packPity.legendary) rarity = 'legendary';
            else if (packPity.epic && newEpicCount >= packPity.epic) rarity = 'epic';
            else {
                const roll = Math.random();
                if (roll < pack.rates.legendary) rarity = 'legendary';
                else if (roll < pack.rates.legendary + pack.rates.epic) rarity = 'epic';
                else rarity = 'rare';
            }

            if (rarity === 'legendary') { newCount = 0; newEpicCount = 0; }
            else if (rarity === 'epic') { newEpicCount = 0; }

            const stateKey = isForge ? 'forgeDogs' : 'dogs';
            const configMap = isForge ? ForgeDogsConfig : DogsConfig;
            const pool = Object.keys(configMap).filter(id => configMap[id].rarity === rarity);
            if (pool.length === 0) return prevState;

            const pickedId = pool[Math.floor(Math.random() * pool.length)];
            const fragsGained = FREE_FRAGMENTS_PER_RARITY[rarity];
            const currentDog = prevState[stateKey]?.[pickedId];
            if (!currentDog) return prevState;

            return {
                ...prevState,
                [stateKey]: { ...prevState[stateKey], [pickedId]: { ...currentDog, fragments: (currentDog.fragments ?? 0) + fragsGained } },
                gachaPity: { ...prevState.gachaPity, [pityKey]: { count: newCount, epicCount: newEpicCount } },
                lastFreePull: { ...prevState.lastFreePull, [pullKey]: Date.now() },
                totalSummons: (prevState.totalSummons ?? 0) + 1,
                lastPackResult: { dogId: pickedId, rarity, fragments: fragsGained, isForge }
            };
        });
    };

    const MINE_COMP_DURATION_S = 10 * 60;

    // ========== ASIGNAR PERRO A MINA PASIVA ==========
    const handleAssignMineDog = (dogId, mineId) => {
        setGameState(prevState => {
            const dog = prevState.dogs[dogId];
            if (!dog || !dog.hired) return prevState;
            if (dog.assignedTo !== null) return prevState;

            const slotTaken = Object.values(prevState.dogs).some(
                d => d && typeof d === 'object' && !Array.isArray(d) && d.assignedTo?.mineComp === mineId
            );
            if (slotTaken) return prevState;

            const currentRemaining = dog.mineCompTimer?.remaining ?? 0;
            const newRemaining = currentRemaining > 0 ? currentRemaining : MINE_COMP_DURATION_S;

            return {
                ...prevState,
                dogs: {
                    ...prevState.dogs,
                    [dogId]: {
                        ...dog,
                        assignedTo: { mineComp: mineId },
                        mineCompTimer: { remaining: newRemaining, activeFrom: Date.now() },
                    },
                },
            };
        });
    };

    // ========== DESASIGNAR PERRO DE MINA PASIVA ==========
    const handleUnassignMineDog = (dogId) => {
        setGameState(prevState => {
            const dog = prevState.dogs[dogId];
            if (!dog || dog.assignedTo?.mineComp === undefined) return prevState;

            return {
                ...prevState,
                dogs: {
                    ...prevState.dogs,
                    [dogId]: {
                        ...dog,
                        assignedTo: null,
                        mineCompTimer: {
                            remaining: dog.mineCompTimer?.remaining ?? 0,
                            activeFrom: null,
                        },
                    },
                },
            };
        });
    };

    return {
        handleHireDog,
        handleAssignDog,
        handleUnassignDog,
        handleDogTick,
        handleHireForgeDog,
        handleAssignForgeDog,
        handleUnassignForgeDog,
        handleUnlockWithFragments,
        handleUpgradeStar,
        handleOpenPack,
        handleFreePull,
        handleAssignMineDog,
        handleUnassignMineDog,
    };
};
