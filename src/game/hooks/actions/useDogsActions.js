import { DogsConfig } from '../../config/DogsConfig.js';
import { ForgeDogsConfig } from '../../config/ForgeDogsConfig.js';
import { ForgeConfig } from '../../config/ForgeConfig.js';

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

            const { biome, slotId } = dog.assignedTo;
            const slot = prevState.yacimientos[biome].slots.find(s => s.id === slotId);
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

            const dogConfig = DogsConfig[dog.id];
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

    return {
        handleHireDog,
        handleAssignDog,
        handleUnassignDog,
        handleDogTick,
        handleHireForgeDog,
        handleAssignForgeDog,
        handleUnassignForgeDog,
    };
};
