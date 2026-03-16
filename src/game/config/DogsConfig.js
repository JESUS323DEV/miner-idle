export const DogsConfig = {
    lady: {
        id: 'lady',
        name: 'Lady',
        unlockCost: { gold: 10000, tavernCoins: 1 },
        miningPower: 1,        // materiales por tick
        miningSpeed: 5,        // segundos entre ticks
        biomeBonus: {
            bronze: 1.5,       // multiplica miningPower en este bioma
            iron: 1.0,
            diamond: 1.0,
        }
    },
    tokio: {
        id: 'tokio',
        name: 'Tokio',
        unlockCost: { gold: 50000, tavernCoins: 3 },
        miningPower: 2,
        miningSpeed: 5,
        biomeBonus: {
            bronze: 1.0,
            iron: 1.5,
            diamond: 1.0,
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
        }
    }
};