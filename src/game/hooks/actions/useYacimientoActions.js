import { checkMilestone } from '../helpers/milestoneHelpers.js';

export const useYacimientoActions = (gameState, setGameState) => {

    // ========== PLANTAR MENA ==========
    const handlePlantMena = (slotId, biome) => {
        setGameState(prevState => {
            const slot = prevState.yacimientos[biome].slots.find(s => s.id === slotId);
            if (!slot || !slot.unlocked || slot.mena !== null) return prevState;

            const cost = prevState.yacimientos[biome].plantCost;
            if (!cost) return prevState;
            if (prevState[biome] < cost.amount) return prevState;

            const config = prevState.yacimientos[biome].slotConfig[slotId];

            const newMena = {
                type: biome,
                level: 1,
                durability: config.maxDurability,
                maxDurability: config.maxDurability,
                growthTime: config.growthTime,
                plantedAt: Date.now(),
                ready: false,
                repairingUntil: null,
            };
            console.log('config:', config);
            console.log('growthTime:', config.growthTime);
            return {
                ...prevState,
                [biome]: prevState[biome] - cost.amount,
                yacimientos: {
                    ...prevState.yacimientos,
                    [biome]: {
                        ...prevState.yacimientos[biome],
                        slots: prevState.yacimientos[biome].slots.map(s =>
                            s.id === slotId ? { ...s, mena: newMena } : s
                        )
                    }
                }
            };
        });
    };

    // ========== MINAR YACIMIENTO ==========
    const handleMineYacimiento = (slotId, biome, onGain) => {
        setGameState(prevState => {
            const slot = prevState.yacimientos[biome].slots.find(s => s.id === slotId);
            if (!slot || !slot.mena) return prevState;

            const mena = slot.mena;

            if (mena.repairingUntil && Date.now() < mena.repairingUntil) return prevState;
            const isReady = mena.ready || (Date.now() - mena.plantedAt >= mena.growthTime * 1000);
            if (!isReady) return prevState;

            if (mena.durability <= 0) return prevState;
            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) return prevState;

            const baseDrop = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
            const miningPowerPerTier = prevState.pickaxe.miningPowerPerTier ?? 0;
            const materialGained = Math.floor(baseDrop + (prevState.pickaxe.tier * miningPowerPerTier));
            const newDurability = Math.max(0, mena.durability - 1);

            if (onGain) onGain(materialGained);

            return {
                ...prevState,
                [biome]: (prevState[biome] ?? 0) + materialGained,
                stamina: prevState.stamina - 1,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: prevState.pickaxe.durability - 1
                },
                yacimientos: {
                    ...prevState.yacimientos,
                    [biome]: {
                        ...prevState.yacimientos[biome],
                        slots: prevState.yacimientos[biome].slots.map(s =>
                            s.id === slotId ? {
                                ...s,
                                mena: {
                                    ...mena,
                                    ready: true,
                                    durability: newDurability,
                                }
                            } : s
                        )
                    }
                }
            };
        });
    };

    // ========== REPARAR YACIMIENTO ==========
    const handleRepairYacimiento = (slotId, biome) => {
        setGameState(prevState => {
            const slot = prevState.yacimientos[biome].slots.find(s => s.id === slotId);
            if (!slot || !slot.mena) return prevState;

            const mena = slot.mena;
            if (mena.durability >= mena.maxDurability) return prevState;

            const config = prevState.yacimientos[biome].slotConfig[slotId];
            if (prevState.gold < config.repairCost) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - config.repairCost,
                totalGoldSpent: prevState.totalGoldSpent + config.repairCost,
                yacimientos: {
                    ...prevState.yacimientos,
                    [biome]: {
                        ...prevState.yacimientos[biome],
                        slots: prevState.yacimientos[biome].slots.map(s =>
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
                }
            };
        });
    };

    // ========== DESBLOQUEAR SLOT DE YACIMIENTO ==========
    const handleUnlockYacimientoSlot = (slotId, biome) => {
        setGameState(prevState => {
            const slot = prevState.yacimientos[biome].slots.find(s => s.id === slotId);
            if (!slot || slot.unlocked) return prevState;

            const cost = prevState.yacimientos[biome].unlockCosts[slotId];
            if (!cost) return prevState;
            if (prevState.gold < cost.gold) return prevState;
            if (prevState[biome] < cost.amount) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + cost.gold;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - cost.gold,
                [biome]: prevState[biome] - cost.amount,
                totalGoldSpent: newGoldSpent,
                yacimientos: {
                    ...prevState.yacimientos,
                    [biome]: {
                        ...prevState.yacimientos[biome],
                        slots: prevState.yacimientos[biome].slots.map(s =>
                            s.id === slotId ? { ...s, unlocked: true } : s
                        )
                    }
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    // ========== MINAR YACIMIENTO (PERRO) ==========
    // No consume stamina ni durabilidad del pico, usa stats propias del perro
    const handleDogMineYacimiento = (slotId, biome, dog, onGain) => {
        setGameState(prevState => {
            const slot = prevState.yacimientos[biome].slots.find(s => s.id === slotId);
            if (!slot || !slot.mena) return prevState;

            const mena = slot.mena;
            if (mena.repairingUntil && Date.now() < mena.repairingUntil) return prevState;
            const isReady = mena.ready || (Date.now() - mena.plantedAt >= mena.growthTime * 1000);
            if (!isReady) return prevState;
            if (mena.durability <= 0) return prevState;

            const materialGained = dog?.mineAmount ?? 1;
            const newDurability = Math.max(0, mena.durability - 1);

            if (onGain) onGain(materialGained);

            return {
                ...prevState,
                [biome]: (prevState[biome] ?? 0) + materialGained,
                yacimientos: {
                    ...prevState.yacimientos,
                    [biome]: {
                        ...prevState.yacimientos[biome],
                        slots: prevState.yacimientos[biome].slots.map(s =>
                            s.id === slotId ? {
                                ...s,
                                mena: {
                                    ...mena,
                                    ready: true,
                                    durability: newDurability,
                                }
                            } : s
                        )
                    }
                }
            };
        });
    };

    return {
        handlePlantMena,
        handleMineYacimiento,
        handleDogMineYacimiento,
        handleRepairYacimiento,
        handleUnlockYacimientoSlot,
    };
};
