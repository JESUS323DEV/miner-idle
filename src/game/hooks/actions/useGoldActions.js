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

            if (prevState.pickaxe.durability <= 0) {
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
            let rechargeReduction = 0;
            for (const dogId of (prevState.dogs?.globalSlots ?? [])) {
                if (!dogId) continue;
                const dogBonus = DogsConfig[dogId]?.goldMineBonus;
                if (!dogBonus) continue;
                if (dogBonus.type === 'extraGold') dogBonusGold += dogBonus.value;
                else if (dogBonus.type === 'doubleHit') { if (Math.random() < dogBonus.chance) dogBonusGold += goldGained; }
                else if (dogBonus.type === 'freeHit') { if (Math.random() < dogBonus.chance) rechargeReduction++; }
            }

            const totalGold = goldGained + dogBonusGold;
            const prevBurst = prevState.burst ?? { active: false, recharging: false, rechargeRemaining: 0 };
            let newBurst = prevBurst;
            if (rechargeReduction > 0 && prevBurst.recharging) {
                const newRemaining = Math.max(0, prevBurst.rechargeRemaining - rechargeReduction);
                newBurst = newRemaining <= 0
                    ? { active: false, recharging: false, rechargeRemaining: 0 }
                    : { ...prevBurst, rechargeRemaining: newRemaining };
            }

            return {
                ...prevState,
                totalClicks: newTotalClicks,
                totalGoldEarned: newTotalGoldEarned,
                gold: prevState.gold + totalGold,
                burst: newBurst,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: prevState.pickaxe.durability - 1
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
            if (prevState.pickaxe.durability <= 0) return prevState;

            const newTotalGoldEarned = prevState.totalGoldEarned + prevState.pickaxe.goldPerMine;
            const hasGoldMilestone = checkMilestone(prevState.rewards.goldMilestones, newTotalGoldEarned);

            let dogBonusGold = 0;
            let rechargeReduction = 0;
            for (const dogId of (prevState.dogs?.globalSlots ?? [])) {
                if (!dogId) continue;
                const dogBonus = DogsConfig[dogId]?.goldMineBonus;
                if (!dogBonus) continue;
                if (dogBonus.type === 'extraGold') dogBonusGold += dogBonus.value;
                else if (dogBonus.type === 'doubleHit') { if (Math.random() < dogBonus.chance) dogBonusGold += prevState.pickaxe.goldPerMine; }
                else if (dogBonus.type === 'freeHit') { if (Math.random() < dogBonus.chance) rechargeReduction++; }
            }

            const totalGold = prevState.pickaxe.goldPerMine + dogBonusGold;
            const prevBurst = prevState.burst ?? { active: false, recharging: false, rechargeRemaining: 0 };
            let newBurst = prevBurst;
            if (rechargeReduction > 0 && prevBurst.recharging) {
                const newRemaining = Math.max(0, prevBurst.rechargeRemaining - rechargeReduction);
                newBurst = newRemaining <= 0
                    ? { active: false, recharging: false, rechargeRemaining: 0 }
                    : { ...prevBurst, rechargeRemaining: newRemaining };
            }

            return {
                ...prevState,
                gold: prevState.gold + totalGold,
                totalGoldEarned: newTotalGoldEarned,
                burst: newBurst,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: prevState.pickaxe.durability - 1
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldMilestone,
                }
            };
        });
    };

    // ========== BURST ==========

    const getRechargeTime = (level) => {
        if (level <= 20) return Math.round(40 - level * 0.5);
        if (level <= 40) return Math.round(30 - (level - 20) * 0.25);
        if (level <= 55) return Math.round(25 - (level - 40) * (5 / 15));
        return 20;
    };

    const handleActivateBurst = () => {
        setGameState(prevState => {
            const burst = prevState.burst ?? { active: false, recharging: false, rechargeRemaining: 0 };
            const maxStamina = prevState.maxStamina ?? 15;
            if (burst.active || burst.recharging) return prevState;
            return {
                ...prevState,
                stamina: maxStamina,
                burst: { active: true, recharging: false, rechargeRemaining: 0 }
            };
        });
    };

    const handleBuyMaxStaminaUpgrade = () => {
        const isFree = !gameState.tutorial?.staminaUpgradeDone;
        const cost = isFree ? 0 : gameState.maxStaminaCost;
        if (!isFree && cost > 0) showGoldCost(cost);

        setGameState(prevState => {
            const isFree = !prevState.tutorial?.staminaUpgradeDone;
            const cost = isFree ? 0 : prevState.maxStaminaCost;
            if (!isFree && prevState.gold < cost) return prevState;
            if (prevState.maxStaminaLevel >= 55) return prevState;

            const newLevel = prevState.maxStaminaLevel + 1;
            const newMax = Math.min(15 + newLevel, 60);
            const newGoldSpent = prevState.totalGoldSpent + cost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - cost,
                totalGoldSpent: newGoldSpent,
                maxStamina: newMax,
                maxStaminaLevel: newLevel,
                maxStaminaCost: prevState.maxStaminaCost + prevState.maxStaminaCostIncrease,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                },
                tutorial: prevState.tutorial ? {
                    ...prevState.tutorial,
                    staminaUpgradeDone: true,
                    currentStep: 2
                } : prevState.tutorial
            };
        });
    };

    return {
        handleMine,
        handleMineClick,
        handleBuyGoldPerSecondUpgrade,
        handleActivateBurst,
        handleBuyMaxStaminaUpgrade,
    };
};
