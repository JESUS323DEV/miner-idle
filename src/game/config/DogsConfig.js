export const RARITY_COLORS = {
    legendary: '#fbb534',
    epic: '#b45cff',
    rare: '#4ca8ff',
    common: '#aaaaaa',
};


//=========================LEGENDARIAS
export const DogsConfig = {

    //TOKYO LEGENDARIA PARA MINA DE BRONZE
    tokio: {
        rarity: 'legendary',
        id: 'tokio',
        name: 'Tokio',
        unlockCost: { gold: 2000000, tavernCoins: 80 },
        miningPower: 5,
        miningSpeed: 0.5,
        biomeBonus: {
            bronze: 5.0,
            iron: 2,
            diamond: 3,
        },
        goldMineBonus: {
            type: 'freeHit',
            chance: 0.25  // 20% de que no consuma stamina ni durabilidad
        }
    },


    //TUKA LEGENDARIA PARA MINA DE IRON
    tuka: {
        rarity: 'legendary',
        id: 'tuka',
        name: 'Tuka',
        unlockCost: { gold: 2500000, tavernCoins: 100 },
        miningPower: 5,
        miningSpeed: 0.5,
        biomeBonus: {
            bronze: 3.0,
            iron: 5.0,
            diamond: 2,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.20  // 20% de doblar el oro ganado
        }
    },

    //LADY LEGENDARIA PARA MINA DE DIAMANTE 
    lady: {
        rarity: 'legendary',
        id: 'lady',
        name: 'Lady',
        unlockCost: { gold: 3000000, tavernCoins: 150 },
        miningPower: 5,
        miningSpeed: 0.5,
        biomeBonus: {
            bronze: 3.0,
            iron: 3.0,
            diamond: 5.0,
        },
        goldMineBonus: {
            type: 'extraGold',
            value: 4  // +4 oro por picada
        }
    },


    //================================ÉPICAS

    //MUNA ÉPICA PARA MINA DE BRONZE
    muna: {
        rarity: 'epic',
        id: 'muna',
        name: 'Muna',
        unlockCost: { gold: 500000, tavernCoins: 20 },
        miningPower: 3,
        miningSpeed: 4,
        biomeBonus: {
            bronze: 2.5,
            iron: 1.0,
            diamond: 1.5,
        },
        goldMineBonus: {
            type: 'extraGold',
            value: 2  // +2 oro por picada
        }
    },




    //SMOKE ÉPICA PARA MINA DE IRON
    smoke: {
        rarity: 'epic',
        id: 'smoke',
        name: 'Smoke',
        unlockCost: { gold: 800000, tavernCoins: 30 },
        miningPower: 3,
        miningSpeed: 3,
        biomeBonus: {
            bronze: 1.5,
            iron: 2.5,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.15 // 15% de doblar el oro ganado
        }
    },


    //NUPITO ÉPICA PARA MINA DE DIAMANTE
    nupito: {
        rarity: 'epic',
        id: 'nupito',
        name: 'Nupito',
        unlockCost: { gold: 1200000, tavernCoins: 45 },
        miningPower: 3,
        miningSpeed: 2,
        biomeBonus: {
            bronze: 1.5,
            iron: 1.5,
            diamond: 2.5,
        },

        goldMineBonus: {
            type: 'freeHit',
            chance: 0.20 // 20% de que no consuma stamina ni durabilidad
        }
    },

    //==================================RARAS

    //DRUH RARA PARA MINA DE BRONZE
    druh: {
        rarity: 'rare',
        id: 'druh',
        name: 'Druh',
        unlockCost: { gold: 50000, tavernCoins: 3 },
        miningPower: 1,
        miningSpeed: 4,
        biomeBonus: {
            bronze: 1.5,
            iron: 1.0,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'freeHit',
            chance: 0.10 // 10% de que no consuma stamina ni durabilidad
        }
    },


    //GORDO RARA PARA MINA DE IRON
    gordo: {
        rarity: 'rare',
        id: 'gordo',
        name: 'Gordo',
        unlockCost: { gold: 100000, tavernCoins: 5 },
        miningPower: 2,
        miningSpeed: 5,
        biomeBonus: {
            bronze: 1.0,
            iron: 1.5,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'extraGold',
            value: 1  // +1 oro por picada
        }
    },



    //ZEUS RARA PARA MINA DE DIAMANTE
    zeus: {
        rarity: 'rare',
        id: 'zeus',
        name: 'Zeus',
        unlockCost: { gold: 200000, tavernCoins: 8 },
        miningPower: 3,
        miningSpeed: 3,
        biomeBonus: {
            bronze: 1.5,
            iron: 1.5,
            diamond: 2.0,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.10 // 10% de doblar el oro ganado
        }
    },


};