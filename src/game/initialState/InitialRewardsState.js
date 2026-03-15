const InitialRewardsState = {

    //ORO picado CONSEGUIDO HISTÓRICO
    goldMilestones: {
        claimed: [],
        firstStep: 1000,   // primer hito
        step: 5000,        // a partir del 2do

        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 3000 },
            { upTo: Infinity, base: 1000, increase: 100, max: 5000 },

        ],
    },

    //ORO GASTADO
    goldSpentMilestones: {

        claimed: [],
        firstStep: 5000,   // primer hito
        step: 10000,           // cada X oro gastado
        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 3000 },
            { upTo: Infinity, base: 1000, increase: 100, max: 1500 },
        ],
    },


    //ORO X SEGUNDO
    goldPerSecondMilestones: {
        claimed: [],

        firstStep: 1,   // primer hito
        step: 1,              // segundo hito

        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 3000 },
            { upTo: Infinity, base: 1000, increase: 100, max: 1500 },

        ],
    },



    //CLICK HISTÓRICOS
    clickMilestones: {
        claimed: [],
        firstStep: 100,   // primer hito
        step: 500,            //segundo hito 400 click

        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 3000 },

            { upTo: Infinity, base: 1000, increase: 100, max: 1500 },
        ],
    },

    //MEJORAR STAMINA HISTÓRICO
    staminaMilestones: {

        claimed: [],
        firstStep: 1,   // primer hito

        step: 1,
        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 3000 },

            { upTo: Infinity, base: 1000, increase: 100, max: 1500 },
        ],
    },


    //MEJORAR PICO HISTÓRICO
    pickaxeMilestones: {
        claimed: [],
        firstStep: 1,   // primer hito

        step: 1,
        totalTiers: 0,
        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 2500 },

            { upTo: Infinity, base: 1000, increase: 300, max: 1500 },
        ],
    },

    //REPAIR HISTÓRICO
    repairMilestones: {
        claimed: [],

        firstStep: 1,   // primer hito
        step: 5,              // segundo hito
        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 2500 },

            { upTo: Infinity, base: 1000, increase: 300, max: 1500 },
        ],
    },

    //REFILL STAMINA HISTÓRICO
    refillMilestones: {
        claimed: [],

        firstStep: 1,   // primer hito
        step: 5,              // segundo hito
        tiers: [
            { upTo: 5, base: 1000, increase: 100, max: 1500 },
            { upTo: 10, base: 1000, increase: 100, max: 2000 },
            { upTo: 15, base: 1000, increase: 100, max: 2500 },

            { upTo: Infinity, base: 1000, increase: 300, max: 1500 },
        ],
    },

    coinRewards: {

        // ===== ÚNICOS — se reclaman una vez =====

        // MINAS — primera entrada
        firstBronzeMine: { claimed: false, unlocked: false, reward: 1, label: 'Primera entrada mina bronce' },
        firstIronMine: { claimed: false, unlocked: false, reward: 2, label: 'Primera entrada mina hierro' },
        firstDiamondMine: { claimed: false, unlocked: false, reward: 3, label: 'Primera entrada mina diamante' },

        // MINAS — desbloqueo lvl2
        unlockBronzeLvl2: { claimed: false, unlocked: false, reward: 1, label: 'Desbloquear Mina Bronce II' },
        unlockIronLvl2: { claimed: false, unlocked: false, reward: 2, label: 'Desbloquear Mina Hierro II' },
        unlockDiamondLvl2: { claimed: false, unlocked: false, reward: 3, label: 'Desbloquear Mina Diamante II' },

        // MINAS — desbloqueo lvl3
        unlockBronzeLvl3: { claimed: false, unlocked: false, reward: 2, label: 'Desbloquear Mina Bronce III' },
        unlockIronLvl3: { claimed: false, unlocked: false, reward: 3, label: 'Desbloquear Mina Hierro III' },
        unlockDiamondLvl3: { claimed: false, unlocked: false, reward: 5, label: 'Desbloquear Mina Diamante III' },

        // PICO — cambio de material
        pickaxeBronze: { claimed: false, unlocked: false, reward: 2, label: 'Pico de Bronce' },
        pickaxeMetal: { claimed: false, unlocked: false, reward: 3, label: 'Pico de Metal' },
        pickaxeDiamond: { claimed: false, unlocked: false, reward: 5, label: 'Pico de Diamante' },

        // FORJA — desbloqueo
        forgeIron: { claimed: false, unlocked: false, reward: 1, label: 'Desbloquear Forja Hierro' },
        forgeDiamond: { claimed: false, unlocked: false, reward: 2, label: 'Desbloquear Forja Diamante' },

        // ===== PROGRESIVOS — dan monedas por hito =====

        // TIER DEL PICO
        pickaxeTiers: {
            claimed: [],
            firstStep: 1,
            step: 1,
            label: 'Tiers de pico',
            tiers: [
                { upTo: 5, base: 1, increase: 0, max: 1 },
                { upTo: 10, base: 1, increase: 0, max: 1 },
                { upTo: 20, base: 2, increase: 0, max: 2 },
                { upTo: Infinity, base: 3, increase: 0, max: 3 },
            ],
        },

        // MEJORAS DE FORJA
        forgeUpgrades: {
            claimed: [],
            firstStep: 1,
            step: 1,
            label: 'Mejoras de forja',
            tiers: [
                { upTo: 3, base: 1, increase: 0, max: 1 },
                { upTo: 6, base: 1, increase: 0, max: 1 },
                { upTo: Infinity, base: 2, increase: 0, max: 2 },
            ],
        },
    },

    hasUnclaimed: false,      // si hay alguna sin reclamar (btn brilla)
};

export default InitialRewardsState;