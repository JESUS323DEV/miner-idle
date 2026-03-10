const InitialYacimientosState = {


    bronze: {
        plantCost: { amount: 20 },

        unlockCosts: {
            "1": { gold: 10000, amount: 30 },
            "2": { gold: 35000, amount: 100 },
        },
        slots: [
            { id: 1, unlocked: false, mena: null },
            { id: 2, unlocked: false, mena: null },
        ],
        slotConfig: {
            1: { maxDurability: 10, repairCost: 10, upgradeCost: 20, growthTime: 60, repairCooldown: 30 },
            2: { maxDurability: 30, repairCost: 20, upgradeCost: 40, growthTime: 120, repairCooldown: 60 },
        }
    },

    iron: {
        plantCost: { amount: 20 },
        unlockCosts: {
            "1": { gold: 55000, amount: 30 },
            "2": { gold: 85000, amount: 50 },
        },
        slots: [
            { id: 1, unlocked: false, mena: null },
            { id: 2, unlocked: false, mena: null },
        ],
        slotConfig: {
            1: { maxDurability: 15, repairCost: 10, upgradeCost: 20, growthTime: 30, repairCooldown: 30 },
            2: { maxDurability: 35, repairCost: 20, upgradeCost: 40, growthTime: 60, repairCooldown: 60 },
        }
    },

    diamond: {
        plantCost: { amount: 20 },
        unlockCosts: {
            "1": { gold: 100000, amount: 30 },
            "2": { gold: 150000, amount: 50 },
        },
        slots: [
            { id: 1, unlocked: false, mena: null },
            { id: 2, unlocked: false, mena: null },
        ],
        slotConfig: {
            1: { maxDurability: 20, repairCost: 10, upgradeCost: 20, growthTime: 30, repairCooldown: 30 },
            2: { maxDurability: 40, repairCost: 20, upgradeCost: 40, growthTime: 60, repairCooldown: 60 },
        }
    },
};

// ESTRUCTURA DE UNA MENA PLANTADA:
// {
//     type: "bronze",
//     level: 1,
//     durability: 50,        — viene de menaConfig[level].maxDurability
//     maxDurability: 50,
//     plantedAt: null,
//     ready: false,
//     repairingUntil: null,
// }

export default InitialYacimientosState;