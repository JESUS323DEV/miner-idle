import { AutomineConfig } from '../../AutomineConfig.js';
import { checkMilestone } from '../helpers/milestoneHelpers.js';

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
            if (prevState.stamina <= 0 || prevState.pickaxe.durability <= 0) return prevState;

            const chargeIndex = prevState.automine.charges.findIndex(c => c.available);
            if (chargeIndex === -1) return prevState;

            const cooldownEnd = Date.now() + (AutomineConfig.chargeRecoveryTime * 1000);
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

    return {
        handleUnlockAutomine,
        handleActivateAutomine,
        handleStopAutomine,
    };
};
