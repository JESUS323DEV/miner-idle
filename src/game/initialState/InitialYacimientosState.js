const InitialYacimientosState = {
    slots: [
        { id: 1, unlocked: true, mena: null },
        { id: 2, unlocked: false, mena: null },
        { id: 3, unlocked: false, mena: null },
    ],

    // Coste de desbloquear slot 2 y 3
    unlockCosts: {
        2: 5000,
        3: 15000,
    },
};

// ESTRUCTURA DE UNA MENA PLANTADA:
// {
//     type: "bronze",          — tipo de material
//     level: 1,                — nivel de la mena (1/2/3)
//     durability: 100,         — durabilidad actual
//     maxDurability: 100,      — durabilidad máxima
//     yieldMin: 1,             — material mínimo por picada
//     yieldMax: 3,             — material máximo por picada
//     repairCost: 10,          — coste en materiales para reparar
//     plantCost: { bronze: 20 }, — coste para plantar
//     growthTime: 30,          — segundos hasta que está lista para picar
//     plantedAt: null,         — timestamp de cuando se plantó
//     ready: false,            — si ya se puede picar
// }

export default InitialYacimientosState;