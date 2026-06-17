export const RARITY_COLORS = {
    legendary: '#fbb534',
    epic: '#b45cff',
    rare: '#4ca8ff',
    common: '#aaaaaa',
};


//=========================LEGENDARIAS
export const DogsConfig = {

    //CHIHUAHUA LEGENDARIA DE REGALO
    chihuahua: {
        rarity: 'legendary',
        order: 0,
        id: 'chihuahua',
        name: 'Chihuahua',
        unlockCost: { gold: 150000, tavernCoins: 10 },
        starGoldCost: 20000,
        starBonus: 0.20,
        unlockFragments: 150,
        starFragments: [200, 400, 600, 800, 1000],
        yacimientoYield: 6,
        miningPower: 3,
        miningSpeed: 1,
        biomeBonus: {
            bronze: 2.0,
            iron: 2.0,
            diamond: 2.0,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.10
        }
    },

    //TUKA LEGENDARIA PARA MINA DE IRON
    tuka: {
        rarity: 'legendary',
        order: 3,
        id: 'tuka',
        name: 'Tuka',
        unlockCost: { gold: 2500000, tavernCoins: 100 },
        starBonus: 0.20,
        unlockFragments: 150,
        starFragments: [200, 400, 600, 800, 1000],
        yacimientoYield: 8,
        miningPower: 5,
        miningSpeed: 0.5,
        biomeBonus: {
            bronze: 3.0,
            iron: 5.0,
            diamond: 2,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.20
        }
    },

    //MUNA LEGENDARIA — EN MEMORIA DE LA PERRA REAL
    muna: {
        rarity: 'legendary',
        order: 2,
        id: 'muna',
        name: 'Muna',
        unlockCost: { gold: 1000000, tavernCoins: 40 },
        starGoldCost: 20000,
        starBonus: 0.20,
        unlockFragments: 150,
        starFragments: [200, 400, 600, 800, 1000],
        yacimientoYield: 7,
        miningPower: 4,
        miningSpeed: 1,
        biomeBonus: {
            bronze: 4.0,
            iron: 2.0,
            diamond: 2.0,
        },
        goldMineBonus: {
            type: 'extraGold',
            value: 3
        }
    },

    //LADY LEGENDARIA PARA MINA DE DIAMANTE
    lady: {
        rarity: 'legendary',
        order: 1,
        id: 'lady',
        name: 'Lady',
        unlockCost: { gold: 3000000, tavernCoins: 150 },
        starBonus: 0.20,
        unlockFragments: 150,
        starFragments: [200, 400, 600, 800, 1000],
        yacimientoYield: 8,
        miningPower: 5,
        miningSpeed: 0.5,
        biomeBonus: {
            bronze: 3.0,
            iron: 3.0,
            diamond: 5.0,
        },
        goldMineBonus: {
            type: 'extraGold',
            value: 4
        }
    },


    //================================ÉPICAS

    //BULLY ÉPICA DE REGALO
    bully: {
        rarity: 'epic',
        id: 'bully',
        name: 'Bully',
        unlockCost: { gold: 30000, tavernCoins: 3 },
        starGoldCost: 8000,
        starBonus: 0.15,
        unlockFragments: 100,
        starFragments: [150, 300, 450, 600, 750],
        yacimientoYield: 3,
        miningPower: 2,
        miningSpeed: 2,
        biomeBonus: {
            bronze: 1.5,
            iron: 1.5,
            diamond: 1.5,
        },
        goldMineBonus: {
            type: 'extraGold',
            value: 1
        }
    },

    //TOKIO LEGENDARIA PARA MINA DE BRONZE
    tokio: {
        rarity: 'legendary',
        order: 4,
        id: 'tokio',
        name: 'Tokio',
        unlockCost: { gold: 2000000, tavernCoins: 80 },
        starBonus: 0.20,
        unlockFragments: 150,
        starFragments: [200, 400, 600, 800, 1000],
        yacimientoYield: 8,
        miningPower: 5,
        miningSpeed: 0.5,
        biomeBonus: {
            bronze: 5.0,
            iron: 2,
            diamond: 3,
        },
        goldMineBonus: {
            type: 'saveDurability',
            chance: 0.20
        }
    },

    //SMOKE ÉPICA PARA MINA DE IRON
    smoke: {
        rarity: 'epic',
        id: 'smoke',
        name: 'Smoke',
        unlockCost: { gold: 800000, tavernCoins: 30 },
        starBonus: 0.15,
        unlockFragments: 100,
        starFragments: [150, 300, 450, 600, 750],
        yacimientoYield: 4,
        miningPower: 3,
        miningSpeed: 3,
        biomeBonus: {
            bronze: 1.5,
            iron: 2.5,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.15
        }
    },


    //NUPITO ÉPICA PARA MINA DE DIAMANTE
    nupito: {
        rarity: 'epic',
        id: 'nupito',
        name: 'Nupito',
        unlockCost: { gold: 1200000, tavernCoins: 45 },
        starBonus: 0.15,
        unlockFragments: 100,
        starFragments: [150, 300, 450, 600, 750],
        yacimientoYield: 4,
        miningPower: 3,
        miningSpeed: 2,
        biomeBonus: {
            bronze: 1.5,
            iron: 1.5,
            diamond: 2.5,
        },
        goldMineBonus: {
            type: 'saveDurability',
            chance: 0.15
        }
    },

    //==================================RARAS

    //BOXER RARA DE REGALO
    boxer: {
        rarity: 'rare',
        id: 'boxer',
        name: 'Boxer',
        unlockCost: { gold: 0, tavernCoins: 0 },
        starGoldCost: 3000,
        starBonus: 0.10,
        unlockFragments: 50,
        starFragments: [100, 200, 300, 400, 500],
        yacimientoYield: 1,
        miningPower: 1,
        miningSpeed: 2,
        biomeBonus: {
            bronze: 1.2,
            iron: 1.0,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'saveDurability',
            chance: 0.05
        }
    },

    //DRUH RARA PARA MINA DE BRONZE
    druh: {
        combatReward: false,
        rarity: 'rare',
        id: 'druh',
        name: 'Druh',
        unlockCost: { gold: 10000, tavernCoins: 3 },
        starBonus: 0.10,
        unlockFragments: 50,
        starFragments: [100, 200, 300, 400, 500],
        yacimientoYield: 2,
        miningPower: 1,
        miningSpeed: 4,
        biomeBonus: {
            bronze: 1.5,
            iron: 1.0,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'saveDurability',
            chance: 0.10
        }
    },


    //GORDO RARA PARA MINA DE IRON
    gordo: {
        rarity: 'rare',
        id: 'gordo',
        name: 'Gordo',
        unlockCost: { gold: 100000, tavernCoins: 5 },
        starBonus: 0.10,
        unlockFragments: 50,
        starFragments: [100, 200, 300, 400, 500],
        yacimientoYield: 2,
        miningPower: 2,
        miningSpeed: 5,
        biomeBonus: {
            bronze: 1.0,
            iron: 1.5,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'extraGold',
            value: 1
        }
    },



    //ZEUS RARA PARA MINA DE DIAMANTE
    zeus: {
        rarity: 'rare',
        id: 'zeus',
        name: 'Zeus',
        unlockCost: { gold: 200000, tavernCoins: 8 },
        starBonus: 0.10,
        unlockFragments: 50,
        starFragments: [100, 200, 300, 400, 500],
        yacimientoYield: 2,
        miningPower: 3,
        miningSpeed: 3,
        biomeBonus: {
            bronze: 1.5,
            iron: 1.5,
            diamond: 2.0,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.10
        }
    },


};
