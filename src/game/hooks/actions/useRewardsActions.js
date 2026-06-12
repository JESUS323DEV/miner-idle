import { checkMilestone, getMilestoneReward } from '../helpers/milestoneHelpers.js';
import { DogsConfig } from '../../config/DogsConfig.js';
import { ForgeDogsConfig } from '../../config/ForgeDogsConfig.js';

export const useRewardsActions = (gameState, setGameState, showGoldGain, showTavernGain) => {

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
                if (key === 'fragmentRewards') return false;
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

                showTavernGain(coinReward.reward);
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

            showTavernGain(reward);
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

    // ========== RECLAMAR RECOMPENSA DE FRAGMENTOS ==========
    const handleClaimFragmentReward = (key) => {
        setGameState(prevState => {
            const reward = prevState.rewards.fragmentRewards?.[key];
            if (!reward || reward.claimed || !reward.unlocked) return prevState;

            let next = { ...prevState };

            // Formato randomFragments: da fragmentos de un perro aleatorio por rareza
            if (reward.randomFragments) {
                for (const { rarity, amount, isForge } of reward.randomFragments) {
                    if (isForge === true) {
                        // Solo perros de forja
                        const pool = Object.keys(ForgeDogsConfig).filter(id => ForgeDogsConfig[id].rarity === rarity);
                        if (pool.length === 0) continue;
                        const pickedId = pool[Math.floor(Math.random() * pool.length)];
                        const dog = next.forgeDogs?.[pickedId];
                        if (!dog) continue;
                        next = { ...next, forgeDogs: { ...next.forgeDogs, [pickedId]: { ...dog, fragments: (dog.fragments ?? 0) + amount } } };
                    } else {
                        // Pool mixto: mineros + forja
                        const minerPool = Object.keys(DogsConfig).filter(id => DogsConfig[id].rarity === rarity).map(id => ({ id, forge: false }));
                        const forgePool = Object.keys(ForgeDogsConfig).filter(id => ForgeDogsConfig[id].rarity === rarity).map(id => ({ id, forge: true }));
                        const pool = [...minerPool, ...forgePool];
                        if (pool.length === 0) continue;
                        const picked = pool[Math.floor(Math.random() * pool.length)];
                        const stateKey = picked.forge ? 'forgeDogs' : 'dogs';
                        const dog = next[stateKey]?.[picked.id];
                        if (!dog) continue;
                        next = { ...next, [stateKey]: { ...next[stateKey], [picked.id]: { ...dog, fragments: (dog.fragments ?? 0) + amount } } };
                    }
                }
            }

            // Formato multi-dog: { dogs: [{ dogId, isForge, amount }] }
            if (reward.dogs) {
                for (const { dogId, isForge, amount } of reward.dogs) {
                    const stateKey = isForge ? 'forgeDogs' : 'dogs';
                    const dog = next[stateKey]?.[dogId];
                    if (!dog) continue;
                    next = { ...next, [stateKey]: { ...next[stateKey], [dogId]: { ...dog, fragments: (dog.fragments ?? 0) + amount } } };
                }
            }

            // Formato legacy: { dogId, isForge, amount }
            if (!reward.dogs && !reward.randomFragments && reward.amount > 0) {
                const stateKey = reward.isForge ? 'forgeDogs' : 'dogs';
                const dog = next[stateKey]?.[reward.dogId];
                if (dog) next = { ...next, [stateKey]: { ...next[stateKey], [reward.dogId]: { ...dog, fragments: (dog.fragments ?? 0) + reward.amount } } };
            }

            const updatedFragRewards = { ...next.rewards.fragmentRewards, [key]: { ...reward, claimed: true } };

            // Si se acaban de reclamar todas las de set1, hacer visibles las de set2
            const set1Keys = ['unlockTaverna', 'unlockMinas', 'unlockForja'];
            const set1AllClaimed = set1Keys.every(k => updatedFragRewards[k]?.claimed);
            if (set1AllClaimed) {
                ['goldPassive5', 'stamina2', 'pickaxeTier2', 'set2Complete'].forEach(k => {
                    if (updatedFragRewards[k]) updatedFragRewards[k] = { ...updatedFragRewards[k], visible: true };
                });
            }

            // Si se acaban de reclamar las 3 primeras de set2, desbloquear set2Complete
            const set2ConditionKeys = ['goldPassive5', 'stamina2', 'pickaxeTier2'];
            const set2AllClaimed = set2ConditionKeys.every(k => updatedFragRewards[k]?.claimed);
            if (set2AllClaimed && updatedFragRewards.set2Complete) {
                updatedFragRewards.set2Complete = { ...updatedFragRewards.set2Complete, unlocked: true };
            }

            // Si se acaba de reclamar set2Complete, hacer visibles las de set3 (minas)
            if (key === 'set2Complete') {
                ['set3Iron', 'set3DogMine', 'set3IronMine', 'set3ForjaBronze', 'set3SmeltBronze', 'set3Complete'].forEach(k => {
                    if (updatedFragRewards[k]) updatedFragRewards[k] = { ...updatedFragRewards[k], visible: true };
                });
            }

            // Si se acaban de reclamar las 5 condiciones de set3, desbloquear set3Complete
            const set3ConditionKeys = ['set3Iron', 'set3DogMine', 'set3IronMine', 'set3ForjaBronze', 'set3SmeltBronze'];
            const set3AllClaimed = set3ConditionKeys.every(k => updatedFragRewards[k]?.claimed);
            if (set3AllClaimed && updatedFragRewards.set3Complete) {
                updatedFragRewards.set3Complete = { ...updatedFragRewards.set3Complete, unlocked: true };
            }

            // Si se acaba de reclamar set3Complete, hacer visibles las de set4
            if (key === 'set3Complete') {
                const set4Keys = ['set4Miner1Star','set4Miner2Star','set4Miner3Star','set4Miner4Star','set4Miner5Star','set4Forge1Star','set4Forge2Star','set4Forge3Star','set4Forge4Star','set4Forge5Star','set4FurnaceBronze2','set4FurnaceBronze3','set4FurnaceIron2','set4FurnaceIron3','set4FurnaceDiamond2','set4FurnaceDiamond3'];
                set4Keys.forEach(k => {
                    if (updatedFragRewards[k]) updatedFragRewards[k] = { ...updatedFragRewards[k], visible: true };
                });
            }

            return { ...next, rewards: { ...next.rewards, fragmentRewards: updatedFragRewards } };
        });
    };

    return {
        handleClaimReward,
        handleClaimCoinReward,
        handleClaimFragmentReward,
    };
};
