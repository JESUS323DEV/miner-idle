import { checkMilestone } from '../helpers/milestoneHelpers.js';

export const usePickaxeActions = (gameState, setGameState, showGoldCost) => {

    // ========== REPARAR PICO ==========
    const handleRepairPickaxe = () => {
        showGoldCost(gameState.pickaxe.repairCost);
        setGameState(prevState => {
            if (prevState.pickaxe.durability >= prevState.pickaxe.maxDurability) return prevState;
            if (prevState.gold < prevState.pickaxe.repairCost) return prevState;

            const newTotalRepairs = prevState.totalRepairs + 1;
            const newGoldSpent = prevState.totalGoldSpent + prevState.pickaxe.repairCost;
            const hasRepairMilestone = checkMilestone(prevState.rewards.repairMilestones, newTotalRepairs);
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - prevState.pickaxe.repairCost,
                totalGoldSpent: newGoldSpent,
                totalRepairs: newTotalRepairs,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: prevState.pickaxe.maxDurability,
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasRepairMilestone || hasGoldSpentMilestone,
                }
            };
        });
    };

    // ========== SUBIR TIER DEL PICO ==========
    const handleUpgradePickaxeTier = () => {
        setGameState(prevState => {
            if (prevState.pickaxe.tier >= 5) return prevState;

            const isFree = !prevState.tutorial?.pickaxeUpgradeDone;
            const cost = isFree ? 0 : (prevState.pickaxe.tierUpgradeCosts?.[prevState.pickaxe.material] || 0);
            const currentTier = prevState.pickaxe.tier;

            const ingotCost = prevState.pickaxe.tierIngotCosts?.[prevState.pickaxe.material]?.[currentTier];
            const ingotType = ingotCost?.type;
            const ingotAmount = ingotCost?.amount || 0;

            if (!isFree && prevState.gold < cost) return prevState;
            if (!isFree && ingotType && prevState[ingotType] < ingotAmount) return prevState;

            const newTotalTiers = prevState.rewards.pickaxeMilestones.totalTiers + 1;
            const newGoldSpent = prevState.totalGoldSpent + cost;
            const hasPickaxeMilestone = checkMilestone(prevState.rewards.pickaxeMilestones, newTotalTiers);
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - cost,
                totalGoldSpent: newGoldSpent,
                [ingotType]: ingotType ? prevState[ingotType] - ingotAmount : prevState[ingotType],
                pickaxe: {
                    ...prevState.pickaxe,
                    miningPower: prevState.pickaxe.miningPower + prevState.pickaxe.miningPowerPerTier,
                    tierUpgradeCosts: {
                        ...prevState.pickaxe.tierUpgradeCosts,
                        [prevState.pickaxe.material]: (prevState.pickaxe.tierUpgradeCosts?.[prevState.pickaxe.material] || 0) * 2
                    },
                    tier: currentTier + 1,
                    maxDurability: prevState.pickaxe.maxDurability + 5,
                    durability: prevState.pickaxe.maxDurability + 5,
                    repairCost: prevState.pickaxe.repairCost + 5,
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasPickaxeMilestone || hasGoldSpentMilestone,
                    pickaxeMilestones: {
                        ...prevState.rewards.pickaxeMilestones,
                        totalTiers: newTotalTiers,
                    }
                },
                tutorial: prevState.tutorial ? {
                    ...prevState.tutorial,
                    pickaxeUpgradeDone: true,
                    openPickaxeModal: false,
                    completed: true,
                    currentStep: 3
                } : prevState.tutorial
            };
        });
    };

    // ========== CAMBIAR MATERIAL DEL PICO ==========
    const handleUpgradePickaxeMaterial = () => {
        setGameState(prevState => {
            if (prevState.pickaxe.tier !== 5) return prevState;

            let newMaterial;
            if (prevState.pickaxe.material === "stone") {
                newMaterial = "bronze";
            } else if (prevState.pickaxe.material === "bronze") {
                newMaterial = "metal";
            } else if (prevState.pickaxe.material === "metal") {
                newMaterial = "diamond";
            }

            const newGoldPerMine = prevState.pickaxe.goldPerMineByMaterial[newMaterial];
            const upgradeCost = prevState.pickaxe.materialUpgradeCosts?.[prevState.pickaxe.material];
            const goldCost = upgradeCost?.gold || 0;
            const ingotType = upgradeCost?.ingot?.type;
            const ingotAmount = upgradeCost?.ingot?.amount || 0;

            if (prevState.gold < goldCost || prevState[ingotType] < ingotAmount) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + goldCost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - goldCost,
                totalGoldSpent: newGoldSpent,
                [ingotType]: prevState[ingotType] - ingotAmount,
                goldPerMine: newGoldPerMine,
                pickaxe: {
                    ...prevState.pickaxe,
                    material: newMaterial,
                    tier: 0,
                    goldPerMine: newGoldPerMine,
                    repairCost: prevState.pickaxe.repairCost + 20,
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                    coinRewards: {
                        ...prevState.rewards.coinRewards,
                        pickaxeBronze: newMaterial === 'bronze'
                            ? { ...prevState.rewards.coinRewards.pickaxeBronze, unlocked: true }
                            : prevState.rewards.coinRewards.pickaxeBronze,
                        pickaxeMetal: newMaterial === 'metal'
                            ? { ...prevState.rewards.coinRewards.pickaxeMetal, unlocked: true }
                            : prevState.rewards.coinRewards.pickaxeMetal,
                        pickaxeDiamond: newMaterial === 'diamond'
                            ? { ...prevState.rewards.coinRewards.pickaxeDiamond, unlocked: true }
                            : prevState.rewards.coinRewards.pickaxeDiamond,
                    }
                },
            };
        });
    };

    return {
        handleRepairPickaxe,
        handleUpgradePickaxeTier,
        handleUpgradePickaxeMaterial,
    };
};
