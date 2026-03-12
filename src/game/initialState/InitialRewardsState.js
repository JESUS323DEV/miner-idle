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


    hasUnclaimed: false,      // si hay alguna sin reclamar (btn brilla)
};

export default InitialRewardsState;