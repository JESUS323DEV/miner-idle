
export const ForgeConfig = {
    furnaces: {
        bronze: {
            unlockCost: 0,
            recipes: { input: 'bronze', inputAmount: 10, output: 'bronzeIngot' },
            levels: { 1: 20, 2: 15, 3: 10 }
        },
        iron: {
            unlockCost: 2000,
            recipes: { input: 'iron', inputAmount: 6, output: 'ironIngot' },
            levels: { 1: 30, 2: 25, 3: 20 }
        },
        diamond: {
            unlockCost: 5000,
            recipes: { input: 'diamond', inputAmount: 2, output: 'diamondIngot' },
            levels: { 1: 40, 2: 35, 3: 30 }
        }
    }
};