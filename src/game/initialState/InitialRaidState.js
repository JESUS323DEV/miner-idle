const InitialRaidState = {

    // ===== RAIDS PASIVAS =====
    // Array de raids activas: [{ raidId, dogIds, startedAt, returnAt }, ...]
    passiveRaids: [],

    // Último resultado por raidId: { forest: {...loot}, caves: {...loot}, ... }
    lastRaidResults: {},
};

export default InitialRaidState;
