import { checkMilestone } from '../helpers/milestoneHelpers.js';

export const useTavernActions = (gameState, setGameState, showGoldCost, showTavernCost) => {

    // ========== CONVERTIR LINGOTES EN MONEDAS ==========
    const handleConvertMaterial = (materialType) => {
        setGameState(prevState => {
            const conversions = {
                bronzeIngot: { amount: 10, coins: 1 },
                ironIngot: { amount: 6, coins: 1 },
                diamondIngot: { amount: 2, coins: 1 }
            };
            const conversion = conversions[materialType];
            if (!conversion) return prevState;
            if (prevState[materialType] < conversion.amount) return prevState;

            return {
                ...prevState,
                [materialType]: prevState[materialType] - conversion.amount,
                tavernCoins: prevState.tavernCoins + conversion.coins
            };
        });
    };

    // ========== CONVERTIR ORO EN LINGOTES ==========
    const handleConvertGoldToIngot = (ingotType) => {
        const costs = {
            bronzeIngot: { gold: 10000, coins: 0 },
            ironIngot: { gold: 20000, coins: 0 },
            diamondIngot: { gold: 0, coins: 1 },
        };
        const cost = costs[ingotType];
        if (cost.gold > 0) showGoldCost(cost.gold);
        if (cost.coins > 0) showTavernCost(cost.coins);
        setGameState(prevState => {
            const costs = {
                bronzeIngot: { gold: 10000, coins: 0 },
                ironIngot: { gold: 20000, coins: 0 },
                diamondIngot: { gold: 0, coins: 1 },
            };
            const cost = costs[ingotType];
            if (!cost) return prevState;
            if (prevState.gold < cost.gold) return prevState;
            if (cost.coins > 0 && prevState.tavernCoins < cost.coins) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - cost.gold,
                tavernCoins: prevState.tavernCoins - cost.coins,
                [ingotType]: prevState[ingotType] + 1,
                totalGoldSpent: prevState.totalGoldSpent + cost.gold,
            };
        });
    };

    // ========== CONVERTIR MONEDAS EN ORO ==========
    const handleConvertCoinsToGold = () => {
        showTavernCost(1);
        setGameState(prevState => {
            if (prevState.tavernCoins < 1) return prevState;

            const newTotalGoldEarned = prevState.totalGoldEarned + 5000;
            const hasGoldMilestone = checkMilestone(prevState.rewards.goldMilestones, newTotalGoldEarned);

            return {
                ...prevState,
                tavernCoins: prevState.tavernCoins - 1,
                gold: prevState.gold + 5000,
                totalGoldEarned: newTotalGoldEarned,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldMilestone,
                }
            };
        });
    };

    // ========== DESBLOQUEAR TABERNA ==========
    const handleUnlockTavern = () => {
        setGameState(prevState => {
            if (prevState.gold < 1000) return prevState;
            if (prevState.tavernUnlocked) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + 1000;
            const hasGoldSpentMilestone = checkMilestone(prevState.rewards.goldSpentMilestones, newGoldSpent);

            return {
                ...prevState,
                gold: prevState.gold - 1000,
                totalGoldSpent: newGoldSpent,
                tavernUnlocked: true,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: prevState.rewards.hasUnclaimed || hasGoldSpentMilestone,
                }
            };
        });
    };

    return {
        handleConvertMaterial,
        handleConvertGoldToIngot,
        handleConvertCoinsToGold,
        handleUnlockTavern,
    };
};
