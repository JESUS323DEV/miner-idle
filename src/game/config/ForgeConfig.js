
export const ForgeConfig = {
    furnaces: {
        bronze: {
            unlockCost: 15000,
            upgradeCosts: { 1: 30000, 2: 40000, 3: 80000 },
            maxLevel: 3,
            recipes: { input: 'bronze', inputAmount: 10, output: 'bronzeIngot' },
            levels: { 1: 20, 2: 15, 3: 10 }
        },
        iron: {
            unlockCost: 25000,
            upgradeCosts: { 1: 45000, 2: 70000, 3: 100000 },
            maxLevel: 3,
            recipes: { input: 'iron', inputAmount: 6, output: 'ironIngot' },
            levels: { 1: 25, 2: 20, 3: 10 }
        },
        diamond: {
            unlockCost: 45000,
            upgradeCosts: { 1: 50000, 2: 100000, 3: 150000 },
            maxLevel: 3,
            recipes: { input: 'diamond', inputAmount: 2, output: 'diamondIngot' },
            levels: { 1: 35, 2: 25, 3: 15 }
        }
    }
};