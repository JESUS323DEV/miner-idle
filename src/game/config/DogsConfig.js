export const RARITY_COLORS = {
    legendary: '#fbb534',
    epic: '#b45cff',
    rare: '#4ca8ff',
    common: '#aaaaaa',
};

// biomeBonus por estrellas [0★, 1★, 2★, 3★, 4★, 5★]
const RARE_BIOME   = [1.00, 1.20, 1.40, 1.60, 1.80, 2.00];
const EPIC_BIOME   = [1.95, 2.55, 2.75, 2.95, 3.15, 3.35];
const LEGEND_BIOME = [2.90, 3.50, 3.70, 3.90, 4.10, 4.30];

export const getBiomeBonusAtStars = (dogId, biome, stars = 0) => {
    const raw = DogsConfig[dogId]?.biomeBonus?.[biome] ?? 1.0;
    if (Array.isArray(raw)) return raw[Math.min(5, stars)] ?? 1.0;
    return raw;
};

//=========================LEGENDARIAS
export const DogsConfig = {

    //CHIHUAHUA LEGENDARIA DE REGALO
    chihuahua: {
        rarity: 'epic',
        element: 'oscuro',
        order: 0,
        id: 'chihuahua',
        name: 'Chihuahua',
        unlockCost: { gold: 150000, tavernCoins: 10 },
        starBonus: 0.15,
        unlockFragments: 100,
        starFragments: [150, 300, 450, 600, 750],
        yacimientoYield: 6,
        miningPower: 3,
        miningSpeed: 1,
        biomeBonus: {
            bronze: EPIC_BIOME,
            iron: 1.0,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.08
        }
    },

    //TUKA LEGENDARIA PARA MINA DE IRON
    tuka: {
        rarity: 'legendary',
        element: 'tierra',
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
            bronze: EPIC_BIOME,
            iron: LEGEND_BIOME,
            diamond: RARE_BIOME,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.20
        }
    },

    //MUNA LEGENDARIA — EN MEMORIA DE LA PERRA REAL
    muna: {
        rarity: 'legendary',
        element: 'agua',
        order: 2,
        id: 'muna',
        name: 'Muna',
        unlockCost: { gold: 1000000, tavernCoins: 40 },
        starBonus: 0.20,
        unlockFragments: 150,
        starFragments: [200, 400, 600, 800, 1000],
        yacimientoYield: 7,
        miningPower: 4,
        miningSpeed: 1,
        biomeBonus: {
            bronze: LEGEND_BIOME,
            iron: RARE_BIOME,
            diamond: RARE_BIOME,
        },
        goldMineBonus: {
            type: 'extraGold',
            value: 3
        }
    },

    //LADY LEGENDARIA PARA MINA DE DIAMANTE
    lady: {
        rarity: 'legendary',
        element: 'fuego',
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
            bronze: EPIC_BIOME,
            iron: EPIC_BIOME,
            diamond: LEGEND_BIOME,
        },
        goldMineBonus: {
            type: 'extraGold',
            value: 4
        }
    },

 //TOKIO LEGENDARIA PARA MINA DE BRONZE
    tokio: {
        rarity: 'legendary',
        element: 'electrico',
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
            bronze: LEGEND_BIOME,
            iron: RARE_BIOME,
            diamond: EPIC_BIOME,
        },
        goldMineBonus: {
            type: 'saveDurability',
            chance: 0.20
        }
    },
    //================================ÉPICAS

    //BULLY ÉPICA DE REGALO
    bully: {
        rarity: 'epic',
        element: 'tierra',
        id: 'bully',
        name: 'Bully',
        unlockCost: { gold: 30000, tavernCoins: 3 },
        starBonus: 0.15,
        unlockFragments: 100,
        starFragments: [150, 300, 450, 600, 750],
        yacimientoYield: 3,
        miningPower: 2,
        miningSpeed: 2,
        biomeBonus: {
            bronze: EPIC_BIOME,
            iron: 1.0,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'extraGold',
            value: 1
        }
    },

    //SMOKE ÉPICA PARA MINA DE IRON
    smoke: {
        rarity: 'epic',
        element: 'fuego',
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
            bronze: RARE_BIOME,
            iron: EPIC_BIOME,
            diamond: 1.0,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.15
        }
    },

    //NUPITO ÉPICA PARA MINA DE DIAMANTE
    nupito: {
        rarity: 'legendary',
        element: 'oscuro',
        id: 'nupito',
        name: 'Nupito',
        unlockCost: { gold: 1200000, tavernCoins: 45 },
        starBonus: 0.20,
        unlockFragments: 150,
        starFragments: [200, 400, 600, 800, 1000],
        yacimientoYield: 4,
        miningPower: 3,
        miningSpeed: 2,
        biomeBonus: {
            bronze: RARE_BIOME,
            iron: RARE_BIOME,
            diamond: LEGEND_BIOME,
        },
        goldMineBonus: {
            type: 'saveDurability',
            chance: 0.20
        }
    },

    //==================================RARAS

    //BOXER RARA DE REGALO
    boxer: {
        rarity: 'rare',
        element: 'agua',
        id: 'boxer',
        name: 'Boxer',
        unlockCost: { gold: 0, tavernCoins: 0 },
        starBonus: 0.10,
        unlockFragments: 50,
        starFragments: [100, 200, 300, 400, 500],
        yacimientoYield: 1,
        miningPower: 1,
        miningSpeed: 2,
        biomeBonus: {
            bronze: RARE_BIOME,
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
        element: 'electrico',
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
            bronze: RARE_BIOME,
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
        element: 'tierra',
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
            iron: RARE_BIOME,
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
        element: 'oscuro',
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
            bronze: 1.0,
            iron: 1.0,
            diamond: RARE_BIOME,
        },
        goldMineBonus: {
            type: 'doubleHit',
            chance: 0.10
        }
    },
};
