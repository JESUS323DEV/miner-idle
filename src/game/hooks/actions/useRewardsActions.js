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
                pickaxeMilestones: prevState.rewards.pickaxeMilestones.totalTiers,
                repairMilestones: prevState.totalRepairs,
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
                if (key === 'staminaMilestones') return false;
                if (key === 'refillMilestones') return false;
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

            const chains = [
                ['goldPassive5','goldPassive10','goldPassive20','goldPassive30','goldPassive40','goldPassive50'],
                ['unlockMineBronze','unlockMineIron','unlockMineDiamond'],
                ['bronze300','iron300','diamond300'],
                ['forgeUnlockBronze','forgeUnlockIron','forgeUnlockDiamond'],
                ['smelt50Bronze','smelt50Iron','smelt50Diamond'],
                ['miner1Star','miner2Star','miner3Star','miner4Star','miner5Star'],
                ['forge1Star','forge2Star','forge3Star','forge4Star','forge5Star'],
                ['picoMaterialBronze','picoMaterialIron','picoMaterialDiamond'],
                ['burst5','burst15','burst30','burst60'],
                ['automineLevel2','automineLevel3'],
                ['passiveRaids5','passiveRaids10','passiveRaids20','passiveRaids40','passiveRaids60'],
                ['dogs1','dogs2','dogs3','dogs4','dogs5','dogs6','dogs7','dogs8','dogs9','dogs10',
                 'dogs11','dogs12','dogs13','dogs14','dogs15','dogs16','dogs17','dogs18','dogs19','dogs20','dogs21'],
                ['summons3','summons5','summons10','summons15','summons20','summons25','summons30','summons35',
                 'summons40','summons45','summons50','summons55','summons60','summons65','summons70','summons75',
                 'summons80','summons85','summons90','summons95','summons100'],
            ];

            for (const chain of chains) {
                const idx = chain.indexOf(key);
                if (idx >= 0 && idx < chain.length - 1) {
                    const nextKey = chain[idx + 1];
                    if (updatedFragRewards[nextKey]) updatedFragRewards[nextKey] = { ...updatedFragRewards[nextKey], visible: true };
                }
            }

            const stillHasUnclaimedGold = Object.entries(next.rewards).some(([k, m]) => {
                if (!m || typeof m !== 'object' || !('claimed' in m) || !Array.isArray(m.claimed)) return false;
                if (k === 'staminaMilestones' || k === 'refillMilestones' || k === 'pickaxeMilestones') return false;
                return checkMilestone(m, {
                    goldMilestones: next.totalGoldEarned,
                    goldSpentMilestones: next.totalGoldSpent,
                    goldPerSecondMilestones: next.goldPerSecond,
                    clickMilestones: next.totalClicks,
                    repairMilestones: next.totalRepairs,
                }[k]);
            });

            return {
                ...next,
                rewards: {
                    ...next.rewards,
                    hasUnclaimed: stillHasUnclaimedGold,
                    fragmentRewards: updatedFragRewards,
                },
            };
        });
    };

    return {
        handleClaimReward,
        handleClaimCoinReward,
        handleClaimFragmentReward,
    };
};
