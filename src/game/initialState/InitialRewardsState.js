const InitialRewardsState = {

    //ORO picado CONSEGUIDO HISTÓRICO
    goldMilestones: {
        claimed: [],          // hitos ya reclamados
        step: 1000,           // cada cuánto oro aparece un hito nuevo
        rewardBase: 1000,     // recompensa del primer hito
        rewardIncrease: 500, // cuánto sube cada hito siguiente
    },

    //ORO GASTADO
    goldSpentMilestones: {
        claimed: [],
        step: 5000,           // cada 5k oro gastado
        rewardBase: 1000,     // recompensa primer hito
        rewardIncrease: 500, // sube cada hito
    },

    //ORO X SEGUNDO
    goldPerSecondMilestones: {
        claimed: [],
        step: 5,              // primer hito en 3 oro/segundo
        rewardBase: 1000,     // recompensa primer hito
        rewardIncrease: 100,  // sube cada hito
    },


    //CLICK HISTÓRICOS
    clickMilestones: {
        claimed: [],
        step: 100,            // primer hito en 100 clicks
        rewardBase: 1000,
        rewardIncrease: 100,
    },

    //STAMINA HISTÓRICO
    staminaMilestones: {
        claimed: [],
        step: 1,              // primer hito en lvl 3
        rewardBase: 1000,
        rewardIncrease: 100,
    },


    //PICO HISTÓRICO
    pickaxeMilestones: {
        claimed: [],
        step: 1,
        totalTiers: 0,
        rewardBase: 1000,
        rewardIncrease: 500,
    },

    //REPAIR HISTÓRICO
    repairMilestones: {
        claimed: [],
        step: 5,              // primer hito en 5 reparaciones
        rewardBase: 1000,
        rewardIncrease: 100,
    },

    //REFILL STAMINA HISTÓRICO
    refillMilestones: {
        claimed: [],
        step: 5,              // primer hito en 5 recargas
        rewardBase: 1000,
        rewardIncrease: 100,
    },


    hasUnclaimed: false,      // si hay alguna sin reclamar (btn brilla)
};

export default InitialRewardsState;