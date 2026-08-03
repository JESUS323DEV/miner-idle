import { AutomineConfig } from '../../config/AutomineConfig.js';
import { checkMilestone } from '../helpers/milestoneHelpers.js';
import { advanceDailyQuestInState } from '../../utils/questUtils.js';

const getEffectiveRecovery = (upgradeLevel) => {
    const reduction = AutomineConfig.chargeUpgrades
        .slice(0, upgradeLevel ?? 0)
        .reduce((sum, u) => sum + u.reductionSeconds, 0);
    return AutomineConfig.chargeRecoveryTime - reduction;
};

// Poder Autominar: 40s base, -1s por nivel, suelo 15s (25 niveles)
const getPoderCooldown = (level) =>
    Math.max(AutomineConfig.poderCooldownFloor, AutomineConfig.poderCooldownBase - (level ?? 0));

// Coste: 1k por nivel hasta nivel 15, luego 10k por nivel hasta el tope (25)
export const getPoderUpgradeCost = (nextLevel) =>
    nextLevel <= 15 ? nextLevel * 1000 : 15000 + (nextLevel - 15) * 10000;

export const useAutomineActions = (gameState, setGameState, showGoldCost) => {

    // ========== DESBLOQUEAR AUTOMINE ==========
    const handleUnlockAutomine = () => {
        showGoldCost(AutomineConfig.unlockCost);
        setGameState(prevState => {
            if (prevState.gold < AutomineConfig.unlockCost) return prevState;
            if (prevState.automine.unlocked) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + AutomineConfig.unlockCost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            const fragReward = prevState.rewards.fragmentRewards?.unlockAutomine;
            return {
                ...prevState,
                gold: prevState.gold - AutomineConfig.unlockCost,
                totalGoldSpent: newGoldSpent,
                automine: {
                    ...prevState.automine,
                    unlocked: true,
                    charges: [
                        { available: true, cooldownUntil: null },
                        { available: true, cooldownUntil: null }
                    ]
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                    fragmentRewards: {
                        ...prevState.rewards.fragmentRewards,
                        unlockAutomine: fragReward && !fragReward.unlocked
                            ? { ...fragReward, unlocked: true }
                            : fragReward,
                    },
                }
            };
        });
    };

    // ========== ACTIVAR AUTOMINE ==========
    const handleActivateAutomine = () => {
        setGameState(prevState => {
            if (!prevState.automine.unlocked) return prevState;
            if (prevState.automine.isActive) return prevState;
            if (prevState.pickaxe.durability <= 0) return prevState;

            const chargeIndex = prevState.automine.charges.findIndex(c => c.available);
            if (chargeIndex === -1) return prevState;

            const effectiveRecovery = getEffectiveRecovery(prevState.automineUpgradeLevel ?? 0);
            const cooldownEnd = Date.now() + (effectiveRecovery * 1000);
            const newCharges = [...prevState.automine.charges];
            newCharges[chargeIndex] = { available: false, cooldownUntil: cooldownEnd };

            return {
                ...prevState,
                automine: { ...prevState.automine, charges: newCharges, isActive: true },
                dailyQuests: advanceDailyQuestInState(prevState.dailyQuests, 'automineUses', 1),
            };
        });
    };

    // ========== DETENER AUTOMINE ==========
    const handleStopAutomine = () => {
        setGameState(prevState => ({
            ...prevState,
            automine: { ...prevState.automine, isActive: false }
        }));
    };

    // ========== MEJORAR RECARGA ==========
    const handleAutomineUpgrade = () => {
        const level = gameState.automineUpgradeLevel ?? 0;
        if (level >= AutomineConfig.chargeUpgrades.length) return;
        const upgrade = AutomineConfig.chargeUpgrades[level];
        if (gameState.gold < upgrade.cost) return;

        showGoldCost(upgrade.cost);
        setGameState(prevState => {
            const prevLevel = prevState.automineUpgradeLevel ?? 0;
            if (prevLevel >= AutomineConfig.chargeUpgrades.length) return prevState;
            const prevUpgrade = AutomineConfig.chargeUpgrades[prevLevel];
            if (prevState.gold < prevUpgrade.cost) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + prevUpgrade.cost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            const newLevel = prevLevel + 1;
            const coinKey = `automineCharge${newLevel}`;
            const coinReward = prevState.rewards.coinRewards[coinKey];

            return {
                ...prevState,
                gold: prevState.gold - prevUpgrade.cost,
                totalGoldSpent: newGoldSpent,
                automineUpgradeLevel: newLevel,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone || (coinReward && !coinReward.unlocked),
                    coinRewards: coinReward
                        ? { ...prevState.rewards.coinRewards, [coinKey]: { ...coinReward, unlocked: true } }
                        : prevState.rewards.coinRewards,
                }
            };
        });
    };

    // ========== PODER — recarga hasta 2 cargas, cooldown 30s ==========
    const handleActivatePoder = () => {
        setGameState(prevState => {
            const now = Date.now();
            if (prevState.poderCooldownUntil && now < prevState.poderCooldownUntil) return prevState;
            if (!prevState.automine?.unlocked) return prevState;

            let recharged = 0;
            const newCharges = prevState.automine.charges.map(c => {
                if (!c.available && recharged < 2) {
                    recharged++;
                    return { available: true, cooldownUntil: null };
                }
                return c;
            });
            if (recharged === 0) return prevState;

            const poderCooldown = getPoderCooldown(prevState.autominePoderLevel ?? 0);
            return {
                ...prevState,
                automine: { ...prevState.automine, charges: newCharges },
                poderCooldownUntil: now + (poderCooldown * 1000),
                dailyQuests: advanceDailyQuestInState(prevState.dailyQuests, 'poderUses', 1),
            };
        });
    };

    // ========== MEJORAR PODER (baja el cooldown) ==========
    const handleBuyAutominePoder = () => {
        const level = gameState.autominePoderLevel ?? 0;
        if (level >= AutomineConfig.poderMaxLevel) return;
        const cost = getPoderUpgradeCost(level + 1);
        if (gameState.gold < cost) return;

        showGoldCost(cost);
        setGameState(prevState => {
            const prevLevel = prevState.autominePoderLevel ?? 0;
            if (prevLevel >= AutomineConfig.poderMaxLevel) return prevState;
            const prevCost = getPoderUpgradeCost(prevLevel + 1);
            if (prevState.gold < prevCost) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + prevCost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            const newPoderLevel = prevLevel + 1;
            const poderCoinKey = newPoderLevel % 5 === 0 ? `poderAutominarLvl${newPoderLevel}` : null;
            const poderCoinReward = poderCoinKey ? prevState.rewards.coinRewards[poderCoinKey] : null;

            return {
                ...prevState,
                gold: prevState.gold - prevCost,
                totalGoldSpent: newGoldSpent,
                autominePoderLevel: newPoderLevel,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone || (poderCoinReward && !poderCoinReward.unlocked),
                    coinRewards: poderCoinReward
                        ? { ...prevState.rewards.coinRewards, [poderCoinKey]: { ...poderCoinReward, unlocked: true } }
                        : prevState.rewards.coinRewards,
                }
            };
        });
    };

    return {
        handleUnlockAutomine,
        handleActivateAutomine,
        handleStopAutomine,
        handleAutomineUpgrade,
        handleActivatePoder,
        handleBuyAutominePoder,
    };
};
