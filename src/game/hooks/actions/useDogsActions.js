import { DogsConfig } from '../../config/DogsConfig.js';
import { ForgeDogsConfig } from '../../config/ForgeDogsConfig.js';
import { ForgeConfig } from '../../config/ForgeConfig.js';
import { PACK_TYPES, FRAGMENTS_PER_RARITY } from '../../config/GachaConfig.js';
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

            return {
                ...prevState,
                gold: prevState.gold - cost.gold,
                tavernCoins: prevState.tavernCoins - cost.tavernCoins,
                dogs: {
                    ...prevState.dogs,
                    [dogId]: { ...dog, hired: true }
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

            return {
                ...prevState,
                dogs: {
                    ...prevState.dogs,
                    [dogId]: { ...dog, assignedTo: { biome, slotId } }
                }
            };
        });
    };

    // ========== DESASIGNAR PERRO ==========
    const handleUnassignDog = (dogId) => {
        setGameState(prevState => {
            const dog = prevState.dogs[dogId];
            if (!dog || dog.assignedTo === null) return prevState;

            return {
                ...prevState,
                dogs: {
                    ...prevState.dogs,
                    [dogId]: { ...dog, assignedTo: null }
                }
            };
        });
    };

    // ========== TICK AUTOMÁTICO DE PERRO ==========
    const handleDogTick = (dogId) => {
        setGameState(prevState => {
            let newState = { ...prevState };
            let newYacimientos = { ...prevState.yacimientos };

            const dog = prevState.dogs[dogId];
            if (!dog || !dog.hired || !dog.assignedTo) return prevState;
            if (dog.assignedTo.globalSlot !== undefined) return prevState; // slot global, sin tick de yacimiento

            const { biome, slotId } = dog.assignedTo;
            const slot = prevState.yacimientos[biome]?.slots?.find(s => s.id === slotId);
            if (!slot || !slot.mena) return prevState;

            const mena = slot.mena;
            const config = prevState.yacimientos[biome].slotConfig[slotId];

            if (mena.repairingUntil && Date.now() < mena.repairingUntil) return prevState;

            const isReady = mena.ready || (Date.now() - mena.plantedAt >= mena.growthTime * 1000);
            if (!isReady) return prevState;

            if (mena.durability <= 0) {
                if (newState.gold < config.repairCost) return prevState;
                newState = {
                    ...newState,
                    gold: newState.gold - config.repairCost,
                    totalGoldSpent: newState.totalGoldSpent + config.repairCost,
                };
                newYacimientos = {
                    ...newYacimientos,
                    [biome]: {
                        ...newYacimientos[biome],
                        slots: newYacimientos[biome].slots.map(s =>
                            s.id === slotId ? {
                                ...s,
                                mena: {
                                    ...mena,
                                    durability: mena.maxDurability,
                                    repairingUntil: Date.now() + (config.repairCooldown * 1000),
                                }
                            } : s
                        )
                    }
                };
                return { ...newState, yacimientos: newYacimientos };
            }

            const dogConfig = getDogStats(dog.id, dog.stars ?? 0, false);
            const bonus = dogConfig.biomeBonus[biome] || 1.0;
            const currentAmount = newState[biome] ?? 0;
            const materialGained = Math.floor(dogConfig.miningPower * bonus);

            newState = {
                ...newState,
                [biome]: currentAmount + materialGained,
            };

            newYacimientos = {
                ...newYacimientos,
                [biome]: {
                    ...newYacimientos[biome],
                    slots: newYacimientos[biome].slots.map(s =>
                        s.id === slotId ? {
                            ...s,
                            mena: {
                                ...mena,
                                ready: true,
                                durability: mena.durability - 1,
                            }
                        } : s
                    )
                }
            };

            return { ...newState, yacimientos: newYacimientos };
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

            return {
                ...prevState,
                gold: prevState.gold - goldCost,
                tavernCoins: prevState.tavernCoins - coinCost,
                [stateKey]: {
                    ...prevState[stateKey],
                    [dogId]: { ...dog, hired: true, stars: 0, fragments: dog.fragments - config.unlockFragments }
                }
            };
        });
    };

    // ========== SUBIR ESTRELLA ==========
    const STAR_COIN_COST = { legendary: 3, epic: 2, rare: 1 };

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
            const coinCost = STAR_COIN_COST[config.rarity] ?? 0;
            if (prevState.tavernCoins < coinCost) return prevState;

            return {
                ...prevState,
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
                lastPackResult: { dogId: pickedId, rarity, fragments: fragsGained, isForge }
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
    };
};
