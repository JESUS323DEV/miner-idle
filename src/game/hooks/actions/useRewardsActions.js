import { checkMilestone, getMilestoneReward } from '../helpers/milestoneHelpers.js';

export const useRewardsActions = (gameState, setGameState, showGoldGain) => {

    // ========== RECLAMAR HITO DE ORO ==========
    const handleClaimReward = (milestoneKey) => {
        setGameState(prevState => {
            const milestone = prevState.rewards[milestoneKey];
            if (!milestone) return prevState;

            const currentValues = {
                goldMilestones: prevState.totalGoldEarned,
                goldSpentMilestones: prevState.totalGoldSpent,
                goldPerSecondMilestones: prevState.goldPerSecond,
                clickMilestones: prevState.totalClicks,
                staminaMilestones: prevState.maxStaminaLevel,
                pickaxeMilestones: prevState.rewards.pickaxeMilestones.totalTiers,
                repairMilestones: prevState.totalRepairs,
                refillMilestones: prevState.totalRefills,
            };

            const currentValue = currentValues[milestoneKey];
            const nextMilestoneValue = milestone.claimed.length === 0
                ? milestone.firstStep
                : milestone.firstStep + milestone.step * milestone.claimed.length;

            if (currentValue < nextMilestoneValue) return prevState;

            const reward = getMilestoneReward(milestone);
            const newClaimed = [...milestone.claimed, nextMilestoneValue];
            showGoldGain(reward);

            const allMilestones = {
                ...prevState.rewards,
                [milestoneKey]: { ...milestone, claimed: newClaimed }
            };
            const stillHasUnclaimed = Object.entries(allMilestones).some(([key, m]) => {
                if (key === 'hasUnclaimed') return false;
                if (key === 'coinRewards') return false;
                if (key === 'pickaxeMilestones') {
                    return checkMilestone(m, prevState.rewards.pickaxeMilestones.totalTiers);
                }
                return checkMilestone(m, currentValues[key]);
            });

            return {
                ...prevState,
                gold: prevState.gold + reward,
                totalGoldEarned: prevState.totalGoldEarned,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: stillHasUnclaimed,
                    [milestoneKey]: {
                        ...milestone,
                        claimed: newClaimed,
                    }
                }
            };
        });
    };

    // ========== RECLAMAR RECOMPENSA DE MONEDAS ==========
    const handleClaimCoinReward = (key) => {
        setGameState(prevState => {
            const coinReward = prevState.rewards.coinRewards[key];
            if (!coinReward) return prevState;

            // ÚNICO — claimed es boolean
            if (typeof coinReward.claimed === 'boolean') {
                if (coinReward.claimed) return prevState;

                return {
                    ...prevState,
                    tavernCoins: prevState.tavernCoins + coinReward.reward,
                    rewards: {
                        ...prevState.rewards,
                        coinRewards: {
                            ...prevState.rewards.coinRewards,
                            [key]: { ...coinReward, claimed: true }
                        }
                    }
                };
            }

            // PROGRESIVO — claimed es array
            const currentValues = {
                pickaxeTiers: prevState.rewards.pickaxeMilestones.totalTiers,
                forgeUpgrades: (prevState.furnaces.bronze.level - 1) +
                    (prevState.furnaces.iron.level - 1) +
                    (prevState.furnaces.diamond.level - 1),
            };

            const currentValue = currentValues[key] || 0;
            const nextTarget = coinReward.claimed.length === 0
                ? coinReward.firstStep
                : coinReward.firstStep + coinReward.step * coinReward.claimed.length;

            if (currentValue < nextTarget) return prevState;

            const reward = getMilestoneReward(coinReward);
            const newClaimed = [...coinReward.claimed, nextTarget];

            return {
                ...prevState,
                tavernCoins: prevState.tavernCoins + reward,
                rewards: {
                    ...prevState.rewards,
                    coinRewards: {
                        ...prevState.rewards.coinRewards,
                        [key]: { ...coinReward, claimed: newClaimed }
                    }
                }
            };
        });
    };

    return {
        handleClaimReward,
        handleClaimCoinReward,
    };
};
