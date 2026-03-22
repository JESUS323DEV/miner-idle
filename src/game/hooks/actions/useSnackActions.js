import { SnacksConfig } from '../../initialState/snacksGold/snacksConfig.js';

export const useSnackActions = (gameState, setGameState) => {

    // ========== DESBLOQUEAR SNACK ==========
    const handleUnlockSnack = (snackType) => {
        setGameState(prevState => {
            const cost = SnacksConfig[snackType].unlock.cost;
            if (prevState.tavernCoins < cost) return prevState;
            if (prevState.snacks[snackType].unlocked) return prevState;

            return {
                ...prevState,
                tavernCoins: prevState.tavernCoins - cost,
                snacks: {
                    ...prevState.snacks,
                    [snackType]: { ...prevState.snacks[snackType], unlocked: true, level: 1 }
                }
            };
        });
    };

    // ========== MEJORAR SNACK ==========
    const handleUpgradeSnack = (snackType) => {
        setGameState(prevState => {
            const currentLevel = prevState.snacks[snackType].level;
            if (currentLevel >= 3) return prevState;

            const costKey = currentLevel === 1 ? 'level2' : 'level3';
            const cost = SnacksConfig[snackType].upgrade[costKey];
            if (prevState.tavernCoins < cost) return prevState;

            return {
                ...prevState,
                tavernCoins: prevState.tavernCoins - cost,
                snacks: {
                    ...prevState.snacks,
                    [snackType]: { ...prevState.snacks[snackType], level: currentLevel + 1 }
                }
            };
        });
    };

    // ========== USAR SNACK ==========
    const handleUseSnack = (snackType) => {
        setGameState(prevState => {
            const snack = prevState.snacks[snackType];
            if (!snack.unlocked || snack.level === 0) return prevState;
            if (snack.active !== null) return prevState;

            const hasActiveSnack = Object.values(prevState.snacks).some(s => s.active !== null);
            if (hasActiveSnack) return prevState;

            const useCost = SnacksConfig[snackType].use.cost;
            if (prevState.tavernCoins < useCost) return prevState;

            const effects = SnacksConfig[snackType].effects[`level${snack.level}`];

            let goldBonus;
            if (effects.goldPerSecond.min !== undefined) {
                goldBonus = Math.floor(
                    Math.random() * (effects.goldPerSecond.max - effects.goldPerSecond.min + 1)
                ) + effects.goldPerSecond.min;
            } else {
                goldBonus = effects.goldPerSecond;
            }

            let bonusApplied = null;
            let newState = { ...prevState };

            if (effects.bonus && Math.random() < effects.bonus.chance) {
                const randomBonus = effects.bonus.options[
                    Math.floor(Math.random() * effects.bonus.options.length)
                ];
                bonusApplied = randomBonus;
                if (randomBonus === "refillStamina") newState.stamina = newState.maxStamina;
                else if (randomBonus === "repairPickaxe") {
                    newState.pickaxe = { ...newState.pickaxe, durability: newState.pickaxe.maxDurability };
                }
            }

            return {
                ...newState,
                tavernCoins: newState.tavernCoins - useCost,
                snacks: {
                    ...newState.snacks,
                    [snackType]: {
                        ...snack,
                        active: {
                            startTime: Date.now(),
                            duration: effects.duration,
                            effect: goldBonus,
                            bonusApplied
                        }
                    }
                }
            };
        });
    };

    return {
        handleUnlockSnack,
        handleUpgradeSnack,
        handleUseSnack,
    };
};
