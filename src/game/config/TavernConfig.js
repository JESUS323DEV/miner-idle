export const TavernConfig = {
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
};