import { TavernConfig } from '../../config/TavernConfig.js';
import { DogsConfig } from '../../config/DogsConfig.js';
import { ForgeDogsConfig } from '../../config/ForgeDogsConfig.js';

export const useTavernActions = (gameState, setGameState, showGoldCost, showTavernCost, showTavernGain) => {

    // ========== CONVERTIR LINGOTES EN MONEDAS ==========
    const handleConvertMaterial = (materialType, times = 1) => {
        setGameState(prevState => {
            const conversions = {
                bronzeIngot: { amount: 10, coins: 1 },
                ironIngot: { amount: 6, coins: 1 },
                diamondIngot: { amount: 2, coins: 1 }
            };
            const conversion = conversions[materialType];
            if (!conversion) return prevState;
            const totalAmount = conversion.amount * times;
            const totalCoins = conversion.coins * times;
            if (prevState[materialType] < totalAmount) return prevState;

            showTavernGain(totalCoins);
            return {
                ...prevState,
                [materialType]: prevState[materialType] - totalAmount,
                tavernCoins: prevState.tavernCoins + totalCoins,
                totalExchanges: (prevState.totalExchanges ?? 0) + 1,
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
            return {
                ...prevState,
                tavernCoins: prevState.tavernCoins - 1,
                gold: prevState.gold + 5000,
            };
        });
    };

    // ========== DESBLOQUEAR TABERNA ==========
    const handleUnlockTavern = () => {
        setGameState(prevState => {
            if (prevState.gold < 1000) return prevState;
            if (prevState.tavernUnlocked) return prevState;

            const newGoldSpent = prevState.totalGoldSpent + 1000;
            const fragReward = prevState.rewards.fragmentRewards?.unlockTaverna;
            return {
                ...prevState,
                gold: prevState.gold - 1000,
                totalGoldSpent: newGoldSpent,
                tavernUnlocked: true,
                rewards: {
                    ...prevState.rewards,
                    hasUnclaimed: true,
                    fragmentRewards: {
                        ...prevState.rewards.fragmentRewards,
                        unlockTaverna: fragReward && !fragReward.unlocked
                            ? { ...fragReward, unlocked: true }
                            : fragReward,
                    },
                }
            };
        });
    };

    // ========== ENVIAR PEDIDO (trigo/lupulo) ==========
    const handleSendOrder = (material, dogId, isForge, times = 1) => {
        setGameState(prevState => {
            if (!prevState.bartenderHired) return prevState;
            if (prevState.tavernOrders?.[material]) return prevState;

            const prov = TavernConfig.provisions.find(p => p.id === material);
            if (!prov) return prevState;

            const dog = isForge ? prevState.forgeDogs?.[dogId] : prevState.dogs?.[dogId];
            if (!dog || !dog.hired) return prevState;
            if (dog.assignedTo && dog.assignedTo.globalSlot === undefined) return prevState;

            const total = prov.costPerUnit * prov.buyAmount * times;
            if (prevState.gold < total) return prevState;

            const cfg = isForge ? ForgeDogsConfig[dogId] : DogsConfig[dogId];
            const stars = dog.stars ?? 0;
            const mult = 1 + (cfg?.starBonus ?? 0) * stars;
            const duration = TavernConfig.orders.duration / mult;

            const updatedDogs = { ...prevState.dogs };
            const updatedForgeDogs = { ...prevState.forgeDogs };
            const globalSlots = [...(prevState.dogs.globalSlots ?? [null, null, null])];
            if (dog.assignedTo?.globalSlot !== undefined) globalSlots[dog.assignedTo.globalSlot] = null;

            if (isForge) {
                updatedForgeDogs[dogId] = { ...dog, assignedTo: { type: 'order', material } };
            } else {
                updatedDogs[dogId] = { ...dog, assignedTo: { type: 'order', material } };
            }
            updatedDogs.globalSlots = globalSlots;

            const now = Date.now();
            return {
                ...prevState,
                gold: prevState.gold - total,
                totalGoldSpent: (prevState.totalGoldSpent ?? 0) + total,
                dogs: updatedDogs,
                forgeDogs: updatedForgeDogs,
                tavernOrders: {
                    ...prevState.tavernOrders,
                    [material]: {
                        dogId,
                        isForge,
                        startedAt: now,
                        returnAt: now + duration * 1000,
                        amount: prov.buyAmount * times,
                    },
                },
            };
        });
    };

    // ========== RECLAMAR PEDIDO ==========
    const handleClaimOrder = (material) => {
        setGameState(prevState => {
            const order = prevState.tavernOrders?.[material];
            if (!order || Date.now() < order.returnAt) return prevState;

            const { dogId, isForge, amount } = order;
            const updatedDogs = { ...prevState.dogs };
            const updatedForgeDogs = { ...prevState.forgeDogs };
            if (isForge) {
                if (updatedForgeDogs[dogId]) updatedForgeDogs[dogId] = { ...updatedForgeDogs[dogId], assignedTo: null };
            } else {
                if (updatedDogs[dogId]) updatedDogs[dogId] = { ...updatedDogs[dogId], assignedTo: null };
            }

            const max = prevState.tavernProvisionMaxStock ?? TavernConfig.provisionsMaxStock;
            const current = prevState.tavernStock?.[material] ?? 0;

            return {
                ...prevState,
                dogs: updatedDogs,
                forgeDogs: updatedForgeDogs,
                tavernStock: { ...prevState.tavernStock, [material]: Math.min(max, current + amount) },
                tavernOrders: { ...prevState.tavernOrders, [material]: null },
            };
        });
    };

    return {
        handleConvertMaterial,
        handleConvertGoldToIngot,
        handleConvertCoinsToGold,
        handleUnlockTavern,
        handleSendOrder,
        handleClaimOrder,
    };
};
