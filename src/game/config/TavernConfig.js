export const TavernConfig = {
    bartenderCost: { gold: 50000, coins: 2 },
    conversions: [
        { material: 'bronzeIngot', amount: 10, coins: 1 },
        { material: 'ironIngot',   amount: 6,  coins: 1 },
        { material: 'diamondIngot',amount: 2,  coins: 1 },
    ],
    goldConversions: [
        { ingot: 'bronzeIngot',  gold: 10000, coins: 0, label: 'Lingote Bronze'  },
        { ingot: 'ironIngot',    gold: 20000, coins: 0, label: 'Lingote Iron'    },
        { ingot: 'diamondIngot', gold: 0,     coins: 1, label: 'Lingote Diamond' },
    ],
    coinToGold: 5000,
    provisionsMaxStock: 10,
    stockUpgrades: [
        { to: 15, cost: 5000,    coins: 0  },
        { to: 20, cost: 15000,   coins: 5  },
        { to: 25, cost: 75000,   coins: 10 },
        { to: 30, cost: 100000,  coins: 20 },
    ],
    createdMaxStock: 5,
    createdStockUpgrades: [
        { to: 10, gold: 3000,   coins: 1  },
        { to: 15, gold: 8000,   coins: 2  },
        { to: 20, gold: 20000,  coins: 5  },
        { to: 25, gold: 85000,  coins: 10 },
        { to: 30, gold: 120000, coins: 20 },
    ],
    brewDurations: [15000, 10000, 5000],
    brewOutputs: [1, 4, 5],
    brewUpgrades: [
        { level: 1, duration: 10000, cost: 25000, coins: 5  },
        { level: 2, duration: 5000,  cost: 85000, coins: 10 },
    ],
    provisions: [
        { id: 'trigo',  label: 'Trigo',   costPerUnit: 150, buyAmount: 5 },
        { id: 'lupulo', label: 'Lupulo',  costPerUnit: 200, buyAmount: 5 },
    ],
};