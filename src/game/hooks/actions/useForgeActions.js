import { ForgeConfig } from '../../config/ForgeConfig.js';
import { ForgeDogsConfig } from '../../config/ForgeDogsConfig.js';
import { checkMilestone } from '../helpers/milestoneHelpers.js';

export const useForgeActions = (gameState, setGameState, showGoldCost) => {

    // ========== DESBLOQUEAR HORNO ==========
    const handleUnlockFurnace = (material) => {
        showGoldCost(ForgeConfig.furnaces[material].unlockCost);
        setGameState(prevState => {
            const cost = ForgeConfig.furnaces[material].unlockCost;
            if (prevState.gold < cost) return prevState;
            if (prevState.furnaces[material].unlocked) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + cost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - cost,
                totalGoldSpent: newGoldSpent,
                furnaces: {
                    ...prevState.furnaces,
                    [material]: { ...prevState.furnaces[material], unlocked: true }
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                    coinRewards: {
                        ...prevState.rewards.coinRewards,
                        forgeIron: material === 'iron'
                            ? { ...prevState.rewards.coinRewards.forgeIron, unlocked: true }
                            : prevState.rewards.coinRewards.forgeIron,
                        forgeDiamond: material === 'diamond'
                            ? { ...prevState.rewards.coinRewards.forgeDiamond, unlocked: true }
                            : prevState.rewards.coinRewards.forgeDiamond,
                    }
                },
            };
        });
    };

    // ========== INICIAR FUNDICIÓN ==========
    const handleStartSmelt = (material) => {
        setGameState(prevState => {
            const furnace = prevState.furnaces[material];
            const recipe = ForgeConfig.furnaces[material].recipes;
            if (!furnace.unlocked) return prevState;
            if (furnace.isActive) return prevState;
            if (prevState[recipe.input] < recipe.inputAmount) return prevState;

            const forgeDog = Object.values(prevState.forgeDogs).find(
                d => d && typeof d === 'object' && d.hired && d.assignedTo === material
            );

            let timeReduction = 0;
            if (forgeDog) {
                const dogConfig = ForgeDogsConfig[forgeDog.id];
                timeReduction = dogConfig.forgeBonus.timeReduction || 0;
                const biomeExtra = dogConfig.forgeBonus.biomeBonus[material] || 0;
                timeReduction += biomeExtra;
            }
            console.log('forgeDog:', forgeDog, 'timeReduction:', timeReduction);

            const baseTime = ForgeConfig.furnaces[material].levels[furnace.level];
            const finalTime = Math.max(1, baseTime - timeReduction);

            return {
                ...prevState,
                [recipe.input]: prevState[recipe.input] - recipe.inputAmount,
                furnaces: {
                    ...prevState.furnaces,
                    [material]: {
                        ...furnace,
                        isActive: true,
                        startTime: Date.now(),
                        progress: 0,
                        currentDuration: finalTime
                    }
                }
            };
        });
    };

    // ========== RECOGER LINGOTE ==========
    const handleCollectIngot = (material) => {
        setGameState(prevState => {
            const furnace = prevState.furnaces[material];
            if (!furnace.isActive) return prevState;

            const duration = (furnace.currentDuration ?? ForgeConfig.furnaces[material].levels[furnace.level]) * 1000;
            if (Date.now() - furnace.startTime < duration) return prevState;

            const recipe = ForgeConfig.furnaces[material].recipes;
            const hasMore = prevState[recipe.input] >= recipe.inputAmount;

            const forgeDog = Object.values(prevState.forgeDogs).find(
                d => d && typeof d === 'object' && d.hired && d.assignedTo === material
            );

            let ingotsGained = 1;
            if (forgeDog) {
                const dogConfig = ForgeDogsConfig[forgeDog.id];
                const doubleChance = dogConfig.forgeBonus.doubleIngot || 0;
                if (doubleChance > 0 && Math.random() < doubleChance) {
                    ingotsGained = 2;
                }
            }

            return {
                ...prevState,
                [recipe.output]: prevState[recipe.output] + ingotsGained,
                [recipe.input]: hasMore ? prevState[recipe.input] - recipe.inputAmount : prevState[recipe.input],
                furnaces: {
                    ...prevState.furnaces,
                    [material]: {
                        ...furnace,
                        isActive: hasMore,
                        startTime: hasMore ? Date.now() : null,
                        progress: 0
                    }
                }
            };
        });
    };

    // ========== MEJORAR HORNO ==========
    const handleUpgradeFurnace = (material) => {
        const upgradeCost = ForgeConfig.furnaces[material].upgradeCosts[gameState.furnaces[material].level];
        showGoldCost(upgradeCost);
        setGameState(prevState => {
            const furnace = prevState.furnaces[material];
            const upgradeCost = ForgeConfig.furnaces[material].upgradeCosts[furnace.level];
            if (furnace.level >= ForgeConfig.furnaces[material].maxLevel) return prevState;
            if (prevState.gold < upgradeCost) return prevState;

            const newLevel = furnace.level + 1;
            const newGoldSpent = prevState.totalGoldSpent + upgradeCost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            const forgeDog = Object.values(prevState.forgeDogs).find(
                d => d && typeof d === 'object' && d.hired && d.assignedTo === material
            );

            let timeReduction = 0;
            if (forgeDog) {
                const dogConfig = ForgeDogsConfig[forgeDog.id];
                timeReduction = dogConfig.forgeBonus.timeReduction || 0;
                const biomeExtra = dogConfig.forgeBonus.biomeBonus[material] || 0;
                timeReduction += biomeExtra;
            }

            const baseTime = ForgeConfig.furnaces[material].levels[newLevel];
            const newCurrentDuration = Math.max(1, baseTime - timeReduction);

            return {
                ...prevState,
                gold: prevState.gold - upgradeCost,
                totalGoldSpent: newGoldSpent,
                furnaces: {
                    ...prevState.furnaces,
                    [material]: {
                        ...furnace,
                        level: newLevel,
                        currentDuration: newCurrentDuration
                    }
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    return {
        handleUnlockFurnace,
        handleStartSmelt,
        handleCollectIngot,
        handleUpgradeFurnace,
    };
};
