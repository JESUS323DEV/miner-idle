
export const ForgeConfig = {
    furnaces: {
        bronze: {
            unlockCost: 5000,
            upgradeCosts: { 1: 10000, 2: 20000, 3: 70000 },
            maxLevel: 3,
            recipes: { input: 'bronze', inputAmount: 10, output: 'bronzeIngot' },
            levels: { 1: 20, 2: 15, 3: 10 }
        },
        iron: {
            unlockCost: 15000,
            upgradeCosts: { 1: 15000, 2: 30000, 3: 80000 },
            maxLevel: 3,
            recipes: { input: 'iron', inputAmount: 6, output: 'ironIngot' },
            levels: { 1: 25, 2: 20, 3: 10 }
        },
        diamond: {
            unlockCost: 30000,
            upgradeCosts: { 1: 20000, 2: 30000, 3: 100000 },
            maxLevel: 3,
            recipes: { input: 'diamond', inputAmount: 2, output: 'diamondIngot' },
            levels: { 1: 35, 2: 25, 3: 15 }
        }
    }
};