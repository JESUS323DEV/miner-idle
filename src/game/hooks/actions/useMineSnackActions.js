import MineSnacksConfig from '../../config/MineSnacksConfig.js';
import MinesConfig from '../../config/MinesConfig.js';

export const useMineSnackActions = (gameState, setGameState) => {

    // ========== COMPRAR CARGAS ==========
    const handleBuyMineSnack = (snackId) => {
        setGameState(prevState => {
            const config = MineSnacksConfig[snackId];
            if (!config) return prevState;
            if (prevState.gold < config.costGold) return prevState;
            // Máximo 2 cargas
            if (prevState.mineSnacks[snackId].charges > 0) return prevState;

            return {
                ...prevState,
                gold: prevState.gold - config.costGold,
                totalGoldSpent: prevState.totalGoldSpent + config.costGold,
                mineSnacks: {
                    ...prevState.mineSnacks,
                    [snackId]: {
                        ...prevState.mineSnacks[snackId],
                        charges: prevState.mineSnacks[snackId].charges + config.chargesPerBuy,
                    }
                }
            };
        });
    };

    // ========== USAR SNACK TEMPORAL (automine / toughness) ==========
    const handleUseMineSnack = (snackId) => {
        setGameState(prevState => {
            const config = MineSnacksConfig[snackId];
            if (!config || !config.duration) return prevState;
            if ((prevState.mineSnacks?.[snackId]?.charges ?? 0) <= 0) return prevState;

            const alreadyActive = prevState.mineSnacks?.[snackId]?.activeUntil
                && Date.now() < prevState.mineSnacks[snackId].activeUntil;
            if (alreadyActive) return prevState;

            // Solo uno activo a la vez
            const anyActive = Object.entries(prevState.mineSnacks).some(
                ([id, s]) => id !== snackId && s.activeUntil && Date.now() < s.activeUntil
            );
            if (anyActive) return prevState;

            return {
                ...prevState,
                mineSnacks: {
                    ...prevState.mineSnacks,
                    [snackId]: {
                        ...prevState.mineSnacks[snackId],
                        charges: prevState.mineSnacks[snackId].charges - 1,
                        activeUntil: Date.now() + config.duration,
                    }
                }
            };
        });
    };

    // ========== DINAMITA ==========
    const handleDynamiteMine = () => {
        setGameState(prevState => {
            if (!prevState.mines.currentMine) return prevState;
            if ((prevState.mineSnacks?.dynamite?.charges ?? 0) <= 0) return prevState;

            const currentMine = prevState.mines.currentMine;
            const mineType = currentMine.mineType;
            const baseMineType = mineType.replace('_lvl2', '').replace('_lvl3', '');
            const pickaxeMaterial = prevState.pickaxe.material;
            const yieldRange = MinesConfig[mineType]?.yields?.[pickaxeMaterial];
            if (!yieldRange) return prevState;

            const avgGain = Math.floor((yieldRange.max + yieldRange.min) / 2);
            let totalMaterials = 0;

            const clearedVeins = currentMine.veins.map(vein => {
                totalMaterials += avgGain * vein.remaining;
                return { ...vein, remaining: 0 };
            });

            return {
                ...prevState,
                mineSnacks: {
                    ...prevState.mineSnacks,
                    dynamite: {
                        ...prevState.mineSnacks.dynamite,
                        charges: prevState.mineSnacks.dynamite.charges - 1,
                    }
                },
                mines: {
                    ...prevState.mines,
                    currentMine: {
                        ...currentMine,
                        veins: clearedVeins,
                        resourcesGathered: {
                            ...currentMine.resourcesGathered,
                            [baseMineType]: currentMine.resourcesGathered[baseMineType] + totalMaterials,
                        },
                        clicksCount: currentMine.clicksCount + clearedVeins.length,
                    }
                }
            };
        });
    };

    return {
        handleBuyMineSnack,
        handleUseMineSnack,
        handleDynamiteMine,
    };
};
