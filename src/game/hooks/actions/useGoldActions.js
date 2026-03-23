import { CombosConfig } from '../../config/CombosConfig.js';
import { DogsConfig } from '../../config/DogsConfig.js';
import { checkMilestone } from '../helpers/milestoneHelpers.js';

export const useGoldActions = (gameState, setGameState, showGoldCost, showTavernCost) => {

    // ========== ORO POR SEGUNDO ==========
    const handleBuyGoldPerSecondUpgrade = () => {
        showGoldCost(gameState.goldPerSecondCost);
        setGameState(prevState => {
            if (prevState.gold < prevState.goldPerSecondCost) return prevState;

            const newGoldPerSecond = prevState.goldPerSecond + 1;
            const newGoldSpent = prevState.totalGoldSpent + prevState.goldPerSecondCost;
            const hasGoldPerSecondMilestone = checkMilestone(prevState.rewards.goldPerSecondMilestones, newGoldPerSecond);
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - prevState.goldPerSecondCost,
                totalGoldSpent: newGoldSpent,
                goldPerSecond: newGoldPerSecond,
                goldPerSecondLevel: prevState.goldPerSecondLevel + 1,
                goldPerSecondCost: prevState.goldPerSecondCost + prevState.goldPerSecondCostIncrease,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldPerSecondMilestone || hasGoldSpentMilestone,
                },
                tutorial: prevState.tutorial ? {
                    ...prevState.tutorial,
                    goldPerSecondBought: true,
                    currentStep: 1,
                    openStaminaModal: true
                } : prevState.tutorial
            };
        });
    };

    // ========== MINADO MANUAL ==========
    const handleMineClick = () => {
        setGameState(prevState => {
            const now = Date.now();
            const timeSinceLastClick = prevState.lastClickTime
                ? now - prevState.lastClickTime
                : 0;

            let newCombo;
            if (prevState.comboCount === 0) {
                newCombo = 1;
            } else if (timeSinceLastClick > CombosConfig.resetTime) {
                newCombo = 1;
            } else {
                newCombo = prevState.comboCount + 1;
            }

            const newMaxCombo = Math.max(newCombo, prevState.maxComboEver);

            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) {
                const newClicks = prevState.totalClicks + 1;
                const hasClickMilestone = checkMilestone(prevState.rewards.clickMilestones, newClicks);
                return {
                    ...prevState,
                    comboCount: newCombo,
                    maxComboEver: newMaxCombo,
                    lastClickTime: now,
                    totalClicks: newClicks,
                    rewards: {
                        ...prevState.rewards,
                        hasUnclaimed: prevState.rewards.hasUnclaimed || hasClickMilestone,
                    }
                };
            }

            const isMultipleOf5 = newCombo >= CombosConfig.firstMilestone &&
                newCombo % CombosConfig.milestoneInterval === 0;
            const isNewMilestone = isMultipleOf5 && !prevState.comboMilestones[newCombo];

            let bonusGold = 0;
            let updatedMilestones = prevState.comboMilestones;

            if (isMultipleOf5 && prevState.comboMilestones[newCombo] !== undefined) {
                if (isNewMilestone) {
                    bonusGold = newCombo * CombosConfig.bonusMultiplier;
                    updatedMilestones = { ...prevState.comboMilestones, [newCombo]: true };
                } else {
                    bonusGold = Math.floor(newCombo * CombosConfig.bonusMultiplier * CombosConfig.bonusRepeated);
                }
            }

            const tierGoldBonus = 1 + (prevState.pickaxe.tier * (prevState.pickaxe.goldBonusPerTier || 0));
            const goldGained = Math.floor(prevState.pickaxe.goldPerMine * tierGoldBonus) + bonusGold;
            const newTotalClicks = prevState.totalClicks + 1;
            const newTotalGoldEarned = prevState.totalGoldEarned + goldGained;

            const hasClickMilestone = checkMilestone(prevState.rewards.clickMilestones, newTotalClicks);
            const hasGoldMilestone = checkMilestone(prevState.rewards.goldMilestones, newTotalGoldEarned);

            let dogBonusGold = 0;
            let dogFreeHit = false;
            for (const dogId of (prevState.dogs?.globalSlots ?? [])) {
                if (!dogId) continue;
                const dogBonus = DogsConfig[dogId]?.goldMineBonus;
                if (!dogBonus) continue;
                if (dogBonus.type === 'extraGold') dogBonusGold += dogBonus.value;
                else if (dogBonus.type === 'freeHit') { if (Math.random() < dogBonus.chance) dogFreeHit = true; }
                else if (dogBonus.type === 'doubleHit') { if (Math.random() < dogBonus.chance) dogBonusGold += goldGained; }
            }

            const totalGold = goldGained + dogBonusGold;

            return {
                ...prevState,
                totalClicks: newTotalClicks,
                totalGoldEarned: newTotalGoldEarned,
                gold: prevState.gold + totalGold,
                stamina: dogFreeHit ? prevState.stamina : prevState.stamina - 1,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: dogFreeHit ? prevState.pickaxe.durability : prevState.pickaxe.durability - 1
                },
                comboCount: newCombo,
                maxComboEver: newMaxCombo,
                lastClickTime: now,
                comboMilestones: updatedMilestones,
                lastComboBonus: bonusGold,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasClickMilestone || hasGoldMilestone,
                }
            };
        });
    };

    // ========== MINADO AUTOMÁTICO ==========
    const handleMine = () => {
        setGameState(prevState => {
            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) return prevState;

            const newTotalGoldEarned = prevState.totalGoldEarned + prevState.pickaxe.goldPerMine;
            const hasGoldMilestone = checkMilestone(prevState.rewards.goldMilestones, newTotalGoldEarned);

            let dogBonusGold = 0;
            let dogFreeHit = false;
            for (const dogId of (prevState.dogs?.globalSlots ?? [])) {
                if (!dogId) continue;
                const dogBonus = DogsConfig[dogId]?.goldMineBonus;
                if (!dogBonus) continue;
                if (dogBonus.type === 'extraGold') dogBonusGold += dogBonus.value;
                else if (dogBonus.type === 'freeHit') { if (Math.random() < dogBonus.chance) dogFreeHit = true; }
                else if (dogBonus.type === 'doubleHit') { if (Math.random() < dogBonus.chance) dogBonusGold += prevState.pickaxe.goldPerMine; }
            }

            const totalGold = prevState.pickaxe.goldPerMine + dogBonusGold;

            return {
                ...prevState,
                gold: prevState.gold + totalGold,
                totalGoldEarned: newTotalGoldEarned,
                stamina: dogFreeHit ? prevState.stamina : prevState.stamina - 1,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: dogFreeHit ? prevState.pickaxe.durability : prevState.pickaxe.durability - 1
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldMilestone,
                }
            };
        });
    };

    // ========== STAMINA ==========
    const handleBuyMaxStaminaUpgrade = () => {
        const isFree = !gameState.tutorial?.staminaUpgradeDone;
        const cost = isFree ? 0 : gameState.maxStaminaCost;
        const coinCost = gameState.maxStaminaLevel < 10 ? 1 : 1 + (gameState.maxStaminaLevel - 10);
        if (!isFree && cost > 0) showGoldCost(cost);
        if (!isFree && coinCost > 0) showTavernCost(coinCost);

        setGameState(prevState => {
            const isFree = !prevState.tutorial?.staminaUpgradeDone;
            const cost = isFree ? 0 : prevState.maxStaminaCost;
            const coinCost = prevState.maxStaminaLevel < 10 ? 1 : 1 + (prevState.maxStaminaLevel - 10);
            if (!isFree && prevState.tavernCoins < coinCost) return prevState;
            if (!isFree && prevState.gold < cost) return prevState;

            const newStaminaLevel = prevState.maxStaminaLevel + 1;
            const newGoldSpent = prevState.totalGoldSpent + cost;
            const hasStaminaMilestone = checkMilestone(prevState.rewards.staminaMilestones, newStaminaLevel);
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - cost,
                totalGoldSpent: newGoldSpent,
                maxStamina: prevState.maxStamina + 5,
                stamina: prevState.maxStamina + 5,
                maxStaminaLevel: newStaminaLevel,
                maxStaminaCost: prevState.maxStaminaCost + prevState.maxStaminaCostIncrease,
                staminaRefillCost: prevState.staminaRefillCost + 10,
                tavernCoins: prevState.tavernCoins - (isFree ? 0 : coinCost),
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasStaminaMilestone || hasGoldSpentMilestone,
                },
                tutorial: prevState.tutorial ? {
                    ...prevState.tutorial,
                    staminaUpgradeDone: true,
                    currentStep: 2
                } : prevState.tutorial
            };
        });
    };

    const handleRefillStamina = () => {
        showGoldCost(gameState.staminaRefillCost);
        setGameState(prevState => {
            if (prevState.stamina >= prevState.maxStamina) return prevState;
            if (prevState.gold < prevState.staminaRefillCost) return prevState;

            const newTotalRefills = prevState.totalRefills + 1;
            const newGoldSpent = prevState.totalGoldSpent + prevState.staminaRefillCost;
            const hasRefillMilestone = checkMilestone(prevState.rewards.refillMilestones, newTotalRefills);
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - prevState.staminaRefillCost,
                totalGoldSpent: newGoldSpent,
                totalRefills: newTotalRefills,
                stamina: prevState.maxStamina,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasRefillMilestone || hasGoldSpentMilestone,
                }
            };
        });
    };

    return {
        handleMine,
        handleMineClick,
        handleBuyGoldPerSecondUpgrade,
        handleBuyMaxStaminaUpgrade,
        handleRefillStamina,
    };
};
