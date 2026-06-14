export const SESSION_DURATION = 10 * 60 * 1000; // 10 minutos en ms

const InitialYacimientosState = {
    bronze: {
        unlockCost:   { gold: 15000, tavernCoins: 2 },
        rechargeCost: { gold: 10000 },
        slots: [
            { id: 1, unlocked: false, session: null },
        ],
    },
    iron: {
        unlockCost:   { gold: 20000, tavernCoins: 4 },
        rechargeCost: { gold: 15000 },
        slots: [
            { id: 1, unlocked: false, session: null },
        ],
    },
    diamond: {
        unlockCost:   { gold: 30000, tavernCoins: 6 },
        rechargeCost: { gold: 20000 },
        slots: [
            { id: 1, unlocked: false, session: null },
        ],
    },
};

// ESTRUCTURA DE UNA SESIÓN ACTIVA:
// session: {
//     active: true,
//     startedAt: timestamp,
// }

export default InitialYacimientosState;
