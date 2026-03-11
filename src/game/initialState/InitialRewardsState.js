const InitialRewardsState = {

    //ORO picado CONSEGUIDO HISTÓRICO
    goldMilestones: {
        claimed: [],
        firstStep: 1000,   // primer hito
        step: 2000,        // a partir del 2do
        rewardBase: 1000,
        rewardIncrease: 1000,
    },

    //ORO GASTADO
    goldSpentMilestones: {

        claimed: [],
        firstStep: 2000,   // primer hito
        step: 30000,           // cada X oro gastado
        rewardBase: 2000,     // recompensa primer hito
        rewardIncrease: 2000, // sube cada hito
    },

    //ORO X SEGUNDO
    goldPerSecondMilestones: {
        claimed: [],
        firstStep: 1,   // primer hito
        step: 1,              // segundo hito
        rewardBase: 1000,     // recompensa primer hito
        rewardIncrease: 1000,  // sube cada hito
    },



    //CLICK HISTÓRICOS
    clickMilestones: {
        claimed: [],
        firstStep: 100,   // primer hito

        step: 300,            //segundo hito 400 click
        rewardBase: 1000,
        rewardIncrease: 1000,
    },

    //MEJORAR STAMINA HISTÓRICO
    staminaMilestones: {

        claimed: [],
        firstStep: 1,   // primer hito

        step: 1,
        rewardBase: 1000,
        rewardIncrease: 1000,
    },


    //MEJORAR PICO HISTÓRICO
    pickaxeMilestones: {
        claimed: [],
        firstStep: 1,   // primer hito

        step: 1,
        totalTiers: 0,
        rewardBase: 1000,
        rewardIncrease: 1000,
    },

    //REPAIR HISTÓRICO
    repairMilestones: {
        claimed: [],

        firstStep: 1,   // primer hito
        step: 5,              // segundo hito
        rewardBase: 1000,
        rewardIncrease: 1000,
    },

    //REFILL STAMINA HISTÓRICO
    refillMilestones: {
        claimed: [],

        firstStep: 1,   // primer hito
        step: 5,              // segundo hito
        rewardBase: 1000,
        rewardIncrease: 1000,
    },


    hasUnclaimed: false,      // si hay alguna sin reclamar (btn brilla)
};

export default InitialRewardsState;