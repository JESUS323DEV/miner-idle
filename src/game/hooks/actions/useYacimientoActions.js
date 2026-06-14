import { checkMilestone } from '../helpers/milestoneHelpers.js';

export const useYacimientoActions = (gameState, setGameState) => {

    // ========== DESBLOQUEAR SLOT ==========
    const handleUnlockYacimientoSlot = (slotId, biome) => {
        setGameState(prevState => {
            const slot = prevState.yacimientos[biome].slots.find(s => s.id === slotId);
            if (!slot || slot.unlocked) return prevState;

            const { gold: goldCost, tavernCoins: coinCost } = prevState.yacimientos[biome].unlockCost;
            if (prevState.gold < goldCost) return prevState;
            if (prevState.tavernCoins < coinCost) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + goldCost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - goldCost,
                tavernCoins: prevState.tavernCoins - coinCost,
                totalGoldSpent: newGoldSpent,
                yacimientos: {
                    ...prevState.yacimientos,
                    [biome]: {
                        ...prevState.yacimientos[biome],
                        slots: prevState.yacimientos[biome].slots.map(s =>
                            s.id === slotId ? { ...s, unlocked: true } : s
                        )
                    }
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    // ========== ACTIVAR / RECARGAR SESIÓN ==========
    const handleActivateYacimiento = (slotId, biome) => {
        setGameState(prevState => {
            const slot = prevState.yacimientos[biome].slots.find(s => s.id === slotId);
            if (!slot || !slot.unlocked) return prevState;
            if (slot.session?.active) return prevState;

            const { gold: rechargeCost } = prevState.yacimientos[biome].rechargeCost;
            if (prevState.gold < rechargeCost) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + rechargeCost;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - rechargeCost,
                totalGoldSpent: newGoldSpent,
                yacimientos: {
                    ...prevState.yacimientos,
                    [biome]: {
                        ...prevState.yacimientos[biome],
                        slots: prevState.yacimientos[biome].slots.map(s =>
                            s.id === slotId
                                ? { ...s, session: { active: true, startedAt: Date.now() } }
                                : s
                        )
                    }
                },
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    return {
        handleUnlockYacimientoSlot,
        handleActivateYacimiento,
    };
};
