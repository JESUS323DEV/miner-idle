export const DogsConfig = {
    lady: {
        id: 'lady',
        name: 'Lady',
        unlockCost: { gold: 10000, tavernCoins: 1 },
        miningPower: 1,
        miningSpeed: 5,
        biomeBonus: {
            bronze: 1.5,
            iron: 1.0,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'extraGold',
            value: 1  // +1 oro por picada
        }
    },
    tokio: {
        id: 'tokio',
        name: 'Tokio',
        unlockCost: { gold: 50000, tavernCoins: 3 },
        miningPower: 4,
        miningSpeed: 3,
        biomeBonus: {
            bronze: 1.0,
            iron: 1.5,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'freeHit',
            chance: 0.2  // 20% de que no consuma stamina ni durabilidad
        }
    },
    tuka: {
        id: 'tuka',
        name: 'Tuka',
        unlockCost: { gold: 150000, tavernCoins: 5 },
        miningPower: 3,
        miningSpeed: 5,
        biomeBonus: {
            bronze: 1.0,
            iron: 1.0,
            diamond: 1.5,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.15  // 15% de doblar el oro ganado
        }
    },

    muna: {
        id: 'muna',
        name: 'Muna',
        unlockCost: { gold: 300000, tavernCoins: 8 },
        miningPower: 2,
        miningSpeed: 4,
        biomeBonus: {
            bronze: 1.0,
            iron: 2.0,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'extraGold',
            value: 2
        }
    },
    gordo: {
        id: 'gordo',
        name: 'Gordo',
        unlockCost: { gold: 500000, tavernCoins: 12 },
        miningPower: 4,
        miningSpeed: 8, // lento pero potente
        biomeBonus: {
            bronze: 2.0,
            iron: 1.0,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.25
        }
    },
    druh: {
        id: 'druh',
        name: 'Druh',
        unlockCost: { gold: 800000, tavernCoins: 18 },
        miningPower: 3,
        miningSpeed: 3,
        biomeBonus: {
            bronze: 1.0,
            iron: 1.0,
            diamond: 2.0,
        },
        goldMineBonus: {
            type: 'freeHit',
            chance: 0.3
        }
    },
    smoke: {
        id: 'smoke',
        name: 'Smoke',
        unlockCost: { gold: 1200000, tavernCoins: 25 },
        miningPower: 5,
        miningSpeed: 4,
        biomeBonus: {
            bronze: 1.5,
            iron: 1.5,
            diamond: 1.5,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.35
        }
    },

    nupito: {
        id: 'nupito',
        name: 'Nupito',
        unlockCost: { gold: 2000000, tavernCoins: 35 },
        miningPower: 4,
        miningSpeed: 3,
        biomeBonus: {
            bronze: 1.5,
            iron: 2.0,
            diamond: 1.5,
        },
        goldMineBonus: {
            type: 'extraGold',
            value: 3
        }
    },
    
    zeus: {
        id: 'zeus',
        name: 'Zeus',
        unlockCost: { gold: 3500000, tavernCoins: 50 },
        miningPower: 5,
        miningSpeed: 3,
        biomeBonus: {
            bronze: 2.0,
            iron: 2.0,
            diamond: 2.0,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.45
        }
    },


};