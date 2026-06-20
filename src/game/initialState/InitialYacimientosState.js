export const SESSION_DURATION = 10 * 60 * 1000;
export const COOLDOWN_DURATION = 3 * 60 * 1000;

const InitialYacimientosState = {
    bronze: {
        unlockCost: { gold: 15000, tavernCoins: 2 },
        slots: [
            { id: 1, unlocked: false, session: null },
        ],
    },
    iron: {
        unlockCost: { gold: 20000, tavernCoins: 4 },
        slots: [
            { id: 1, unlocked: false, session: null },
        ],
    },
    diamond: {
        unlockCost: { gold: 30000, tavernCoins: 6 },
        slots: [
            { id: 1, unlocked: false, session: null },
        ],
    },
};

// ESTRUCTURA DE UNA SESIÓN:
// session: {
//     phase: 'mining' | 'cooldown',
//     startedAt: timestamp,
//     lastTick: timestamp | null,   // cambia en cada golpe para trigger visual
// }

export default InitialYacimientosState;
