import { AutomineConfig } from '../../config/AutomineConfig.js';
import { checkMilestone } from '../helpers/milestoneHelpers.js';

const getEffectiveRecovery = (upgradeLevel) => {
    const reduction = AutomineConfig.chargeUpgrades
        .slice(0, upgradeLevel ?? 0)
        .reduce((sum, u) => sum + u.reductionSeconds, 0);
    return AutomineConfig.chargeRecoveryTime - reduction;
};

export const useAutomineActions = (gameState, setGameState, showGoldCost) => {

    // ========== DESBLOQUEAR AUTOMINE ==========
    const handleUnlockAutomine = () => {
        showGoldCost(AutomineConfig.unlockCost);
        setGameState(prevState => {
            if (prevState.gold < AutomineConfig.unlockCost) return prevState;
            if (prevState.automine.unlocked) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + AutomineConfig.unlockCost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

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
                automine: { ...prevState.automine, charges: newCharges, isActive: true }
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

            return {
                ...prevState,
                gold: prevState.gold - prevUpgrade.cost,
                totalGoldSpent: newGoldSpent,
                automineUpgradeLevel: prevLevel + 1,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    // ========== PODER ==========
    const handleActivatePoder = () => {
        setGameState(prevState => {
            const now = Date.now();
            if (prevState.poderCooldownUntil && now < prevState.poderCooldownUntil) return prevState;
            // Efecto: por definir. Por ahora activa un uso extra de automine sin gastar carga
            return {
                ...prevState,
                poderCooldownUntil: now + (AutomineConfig.poderCooldown * 1000),
            };
        });
    };

    return {
        handleUnlockAutomine,
        handleActivateAutomine,
        handleStopAutomine,
        handleAutomineUpgrade,
        handleActivatePoder,
    };
};
