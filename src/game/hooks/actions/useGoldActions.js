import { CombosConfig } from '../../config/CombosConfig.js';
import { DAILY_LOGIN_REWARDS } from '../../config/DailyLoginConfig.js';

export const OFFLINE_GOLD_CONFIG = [
    { unlockCost: 25000,  rate1: 0.05, hours: 10, rate2: 0.02, cap: 100000 },
    { upgradeCost: 50000,  rate1: 0.10, hours: 10, rate2: 0.03, cap: 120000 },
    { upgradeCost: 75000,  rate1: 0.15, hours: 10, rate2: 0.04, cap: 140000 },
    { upgradeCost: 100000, rate1: 0.20, hours: 10, rate2: 0.05, cap: 180000 },
];
// rate1/cap ya no escalan por nivel: al desbloquear se congelan en el máximo (nivel 3).
export const OFFLINE_RATE1_FROZEN = OFFLINE_GOLD_CONFIG[3].rate1;
export const OFFLINE_CAP_FROZEN = OFFLINE_GOLD_CONFIG[3].cap;

// ===== HORAS OFFLINE — mejora nueva, sustituye la progresión vieja de Oro Offline =====
export const OFFLINE_HOURS_BASE = 10;       // horas en nivel 0 (justo al desbloquear)
export const OFFLINE_HOURS_STEP_MIN = 20;   // minutos que suma cada nivel
export const OFFLINE_HOURS_MAX_LEVEL = 30;  // tope: 10h + 30*20min = 20h
export const getOfflineHoursCost = (nextLevel) =>
    nextLevel <= 24 ? nextLevel * 2000 : 48000 + (nextLevel - 24) * 10000;

// ===== RENDIMIENTO OFFLINE — mejora nueva, sube rate2 (ritmo pasada la ventana de horas) =====
export const OFFLINE_RATE2_BASE = 0.01;     // 1% en nivel 0 (justo al desbloquear)
export const OFFLINE_RATE2_STEP = 0.01;     // +1% por nivel
export const OFFLINE_RATE2_MAX_LEVEL = 19;  // tope: 1% + 19*1% = 20% (iguala rate1, nunca lo supera)
export const getOfflineRate2Cost = (nextLevel) =>
    nextLevel <= 15 ? nextLevel * 2000 : 30000 + (nextLevel - 15) * 10000;

import { DogsConfig } from '../../config/DogsConfig.js';
import { ForgeDogsConfig } from '../../config/ForgeDogsConfig.js';
import { checkMilestone } from '../helpers/milestoneHelpers.js';
import { advanceDailyQuestInState, setDailyQuestMaxInState } from '../../utils/questUtils.js';

export const useGoldActions = (gameState, setGameState, showGoldCost) => {

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
                    },
                    dailyQuests: setDailyQuestMaxInState(prevState.dailyQuests, 'maxCombo', newMaxCombo),
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
            let saveDur = false;
            let rechargeReduction = 0;
            let doubleHitCount = 0;
            for (const dogId of (prevState.dogs?.globalSlots ?? [])) {
                if (!dogId) continue;
                const dogBonus = DogsConfig[dogId]?.goldMineBonus;
                if (dogBonus) {
                    if (dogBonus.type === 'extraGold') dogBonusGold += dogBonus.value;
                    else if (dogBonus.type === 'doubleHit') { if (Math.random() < dogBonus.chance) { dogBonusGold += goldGained; doubleHitCount++; } }
                    else if (dogBonus.type === 'saveDurability') { if (!saveDur && Math.random() < dogBonus.chance) saveDur = true; }
                }
                const forgeBonus = ForgeDogsConfig[dogId]?.globalSlotBonus;
                if (forgeBonus?.type === 'burstRecharge') { if (Math.random() < forgeBonus.chance) rechargeReduction++; }
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

            let dq = setDailyQuestMaxInState(prevState.dailyQuests, 'maxCombo', newMaxCombo);
            dq = advanceDailyQuestInState(dq, 'goldMined', totalGold);
            return {
                ...prevState,
                totalClicks: newTotalClicks,
                totalGoldEarned: newTotalGoldEarned,
                gold: prevState.gold + totalGold,
                burst: newBurst,
                pickaxe: {
                    ...prevState.pickaxe,
                    durability: prevState.pickaxe.durability - (saveDur ? 0 : 1)
                },
                comboCount: newCombo,
                maxComboEver: newMaxCombo,
                lastClickTime: now,
                comboMilestones: updatedMilestones,
                lastComboBonus: bonusGold,
                lastMineBonus: (doubleHitCount > 0 || saveDur || rechargeReduction > 0)
                    ? { doubleHitCount, savedDurability: saveDur, burstReduced: rechargeReduction, timestamp: now }
                    : prevState.lastMineBonus,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasClickMilestone || hasGoldMilestone,
                },
                dailyQuests: dq,
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
            let saveDur = false;
            let rechargeReduction = 0;
            for (const dogId of (prevState.dogs?.globalSlots ?? [])) {
                if (!dogId) continue;
                const dogBonus = DogsConfig[dogId]?.goldMineBonus;
                if (dogBonus) {
                    if (dogBonus.type === 'extraGold') dogBonusGold += dogBonus.value;
                    else if (dogBonus.type === 'doubleHit') { if (Math.random() < dogBonus.chance) dogBonusGold += prevState.pickaxe.goldPerMine; }
                    else if (dogBonus.type === 'saveDurability') { if (!saveDur && Math.random() < dogBonus.chance) saveDur = true; }
                }
                const forgeBonus = ForgeDogsConfig[dogId]?.globalSlotBonus;
                if (forgeBonus?.type === 'burstRecharge') { if (Math.random() < forgeBonus.chance) rechargeReduction++; }
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
                    durability: prevState.pickaxe.durability - (saveDur ? 0 : 1)
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldMilestone,
                }
            };
        });
    };

    // ========== BURST ==========

    const handleActivateBurst = () => {
        setGameState(prevState => {
            const burst = prevState.burst ?? { active: false, recharging: false, rechargeRemaining: 0 };
            const drinkBuff = prevState.snacks?.drink?.active?.type === 'stamina' ? (prevState.snacks.drink.active.effect ?? 0) : 0;
            const maxStamina = (prevState.maxStamina ?? 15) + drinkBuff;
            if (burst.active || burst.recharging) return prevState;
            return {
                ...prevState,
                stamina: maxStamina,
                burst: { active: true, recharging: false, rechargeRemaining: 0 },
                totalBurstUses: (prevState.totalBurstUses ?? 0) + 1,
                dailyQuests: advanceDailyQuestInState(prevState.dailyQuests, 'burstUses', 1),
            };
        });
    };

    const handleBuyMaxStaminaUpgrade = () => {
        const cost = gameState.maxStaminaCost;
        if (cost > 0) showGoldCost(cost);

        setGameState(prevState => {
            const cost = prevState.maxStaminaCost;
            const coinCost = prevState.maxStaminaLevel < 10 ? 1 : 1 + (prevState.maxStaminaLevel - 10);
            if (prevState.gold < cost) return prevState;
            if (prevState.tavernCoins < coinCost) return prevState;
            if (prevState.maxStaminaLevel >= 55) return prevState;

            const newLevel = prevState.maxStaminaLevel + 1;
            const newMax = Math.min(15 + newLevel, 60);
            const newGoldSpent = prevState.totalGoldSpent + cost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - cost,
                tavernCoins: prevState.tavernCoins - coinCost,
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

    const handleBuyBurstRecharge = () => {
        const cost = gameState.burstRechargeCost;
        if (cost > 0) showGoldCost(cost);

        setGameState(prevState => {
            const cost = prevState.burstRechargeCost;
            if (prevState.gold < cost) return prevState;
            if (prevState.burstRechargeLevel >= 55) return prevState;

            const newLevel = prevState.burstRechargeLevel + 1;
            const newGoldSpent = prevState.totalGoldSpent + cost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - cost,
                totalGoldSpent: newGoldSpent,
                burstRechargeLevel: newLevel,
                burstRechargeCost: prevState.burstRechargeCost + 1000,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                },
            };
        });
    };

    const handleBuyBurstPower = () => {
        const cost = gameState.burstPowerCost;
        if (cost > 0) showGoldCost(cost);

        setGameState(prevState => {
            const cost = prevState.burstPowerCost;
            if (prevState.gold < cost) return prevState;
            if (prevState.burstPowerLevel >= 55) return prevState;

            const newLevel = prevState.burstPowerLevel + 1;
            const newGoldSpent = prevState.totalGoldSpent + cost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - cost,
                totalGoldSpent: newGoldSpent,
                burstPowerLevel: newLevel,
                burstPowerCost: prevState.burstPowerCost + 1000,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                },
            };
        });
    };

    const handleUnlockOfflineGold = () => {
        const cost = OFFLINE_GOLD_CONFIG[0].unlockCost;
        showGoldCost(cost);
        setGameState(prev => {
            if (prev.offlineGoldLevel >= 0) return prev;
            if (prev.gold < cost) return prev;
            return { ...prev, gold: prev.gold - cost, totalGoldSpent: prev.totalGoldSpent + cost, offlineGoldLevel: 0 };
        });
    };

    const handleBuyOfflineHours = () => {
        const level = gameState.offlineHoursLevel ?? 0;
        if (level >= OFFLINE_HOURS_MAX_LEVEL) return;
        const cost = getOfflineHoursCost(level + 1);
        if (gameState.gold < cost) return;

        showGoldCost(cost);
        setGameState(prevState => {
            const prevLevel = prevState.offlineHoursLevel ?? 0;
            if (prevLevel >= OFFLINE_HOURS_MAX_LEVEL) return prevState;
            const prevCost = getOfflineHoursCost(prevLevel + 1);
            if (prevState.gold < prevCost) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + prevCost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - prevCost,
                totalGoldSpent: newGoldSpent,
                offlineHoursLevel: prevLevel + 1,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    const handleBuyOfflineRate2 = () => {
        const level = gameState.offlineRate2Level ?? 0;
        if (level >= OFFLINE_RATE2_MAX_LEVEL) return;
        const cost = getOfflineRate2Cost(level + 1);
        if (gameState.gold < cost) return;

        showGoldCost(cost);
        setGameState(prevState => {
            const prevLevel = prevState.offlineRate2Level ?? 0;
            if (prevLevel >= OFFLINE_RATE2_MAX_LEVEL) return prevState;
            const prevCost = getOfflineRate2Cost(prevLevel + 1);
            if (prevState.gold < prevCost) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + prevCost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - prevCost,
                totalGoldSpent: newGoldSpent,
                offlineRate2Level: prevLevel + 1,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    const handleClaimDailyLogin = () => {
        const today = new Date().toISOString().split('T')[0];
        setGameState(prev => {
            const dl = prev.dailyLogin ?? { lastClaimedDate: null, streak: 0 };
            if (dl.lastClaimedDate === today) return prev;

            const streak = dl.streak ?? 0;
            const lastDate = dl.lastClaimedDate;
            let currentStreak = streak;

            if (lastDate) {
                const diff = Math.round((new Date(today) - new Date(lastDate)) / 86400000);
                if (diff !== 1) currentStreak = 0;
                else if (streak >= 7) currentStreak = 0;
            }

            const rewardIdx = currentStreak; // 0-based
            const reward = DAILY_LOGIN_REWARDS[rewardIdx];
            const newStreak = currentStreak + 1;

            let updates = { dailyLogin: { lastClaimedDate: today, streak: newStreak } };
            if (reward.type === 'gold')  updates.gold = (prev.gold ?? 0) + reward.amount;
            if (reward.type === 'coins') updates.tavernCoins = (prev.tavernCoins ?? 0) + reward.amount;

            return { ...prev, ...updates };
        });
    };

    return {
        handleMine,
        handleMineClick,
        handleBuyGoldPerSecondUpgrade,
        handleActivateBurst,
        handleBuyMaxStaminaUpgrade,
        handleBuyBurstRecharge,
        handleBuyBurstPower,
        handleUnlockOfflineGold,
        handleBuyOfflineHours,
        handleBuyOfflineRate2,
        handleClaimDailyLogin,
    };
};
