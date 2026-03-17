const InitialYacimientosState = {


    bronze: {
        plantCost: { amount: 0 },

        unlockCosts: {
            "1": { gold: 10000, amount: 10 },
            "2": { gold: 35000, amount: 30 },
        },
        slots: [
            { id: 1, unlocked: false, mena: null },
            { id: 2, unlocked: false, mena: null },
        ],
        slotConfig: {
            1: { maxDurability: 15, repairCost: 1000, upgradeCost: 20, growthTime: 50, repairCooldown: 30 },
            2: { maxDurability: 30, repairCost: 1500, upgradeCost: 40, growthTime: 60, repairCooldown: 60 },
        }
    },

    iron: {
        plantCost: { amount: 0 },
        unlockCosts: {
            "1": { gold: 55000, amount: 10 },
            "2": { gold: 85000, amount: 30 },
        },
        slots: [
            { id: 1, unlocked: false, mena: null },
            { id: 2, unlocked: false, mena: null },
        ],
        slotConfig: {
            1: { maxDurability: 15, repairCost: 1000, upgradeCost: 20, growthTime: 60, repairCooldown: 30 },
            2: { maxDurability: 30, repairCost: 1500, upgradeCost: 40, growthTime: 120, repairCooldown: 60 },
        }
    },

    diamond: {
        plantCost: { amount: 0 },
        unlockCosts: {
            "1": { gold: 100000, amount: 10 },
            "2": { gold: 150000, amount: 30 },
        },
        slots: [
            { id: 1, unlocked: false, mena: null },
            { id: 2, unlocked: false, mena: null },
        ],
        slotConfig: {
            1: { maxDurability: 15, repairCost: 1000, upgradeCost: 20, growthTime: 80, repairCooldown: 30 },
            2: { maxDurability: 30, repairCost: 1500, upgradeCost: 40, growthTime: 160, repairCooldown: 60 },
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