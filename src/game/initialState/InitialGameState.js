import initialSnacksState from "./snacksGold/initialSnacksState.js";

const InitialGameState = {

    // ========== ORO ==========
    gold: 2222100,
    goldPerSecond: 0,
    passiveGoldBuffs: 0,        // Modificador pasivo de oro (eventos/powerups)
    goldBuffSnack: 0,            // Multiplicador de oro por snack activo
    goldPerSecondLevel: 0,       // Nivel actual del upgrade oro/segundo
    goldPerSecondCost: 500,      // Coste actual del upgrade
    goldPerSecondCostIncrease: 1500, // Cuánto sube el coste por nivel

    // ========== MATERIALES ==========
    bronze: 0,
    iron: 0,
    diamond: 0,

    // ========== LINGOTES ==========
    bronzeIngot: 25,
    ironIngot: 10,
    diamondIngot: 5,

    // ========== STAMINA ==========
    stamina: 15,
    maxStamina: 15,
    maxStaminaLevel: 0,
    maxStaminaCost: 500,
    maxStaminaCostIncrease: 5000,
    maxStaminaBuffs: 0,
    staminaBuffs: 0,
    staminaBuffSnack: 0,
    staminaCostPerSecond: 1,
    staminaRefillCost: 30,
    staminaRefillCostIncrease: 1000,
    staminaRefillCount: 0,

    // ========== SNACKS ==========
    snackBuffHasta: null,
    snackLevel: 0,
    snacks: initialSnacksState,

    // ========== MINADO ==========
    isMining: false,

    // ========== AUTOMINE ==========
    automine: {
        unlocked: false,
        maxCharges: 2,
        charges: [
            { available: true, cooldownUntil: null },
            { available: true, cooldownUntil: null }
        ],
        isActive: false
    },

    // ========== COMBOS ==========
    comboCount: 0,
    maxComboEver: 0,
    lastClickTime: null,
    lastComboBonus: 0,
    comboMilestones: {
        20: false, 25: false, 30: false, 35: false, 40: false,
        45: false, 50: false, 55: false, 60: false, 65: false, 70: false
    },

    // ========== FORJA ==========
    forgeUnlocked: true,
    furnaces: {
        bronze: { unlocked: false, level: 1, isActive: false, progress: 0, startTime: null, pendingIngots: 0 },
        iron: { unlocked: false, level: 1, isActive: false, progress: 0, startTime: null, pendingIngots: 0 },
        diamond: { unlocked: false, level: 1, isActive: false, progress: 0, startTime: null, pendingIngots: 0 },
    },

    // ========== TABERNA ==========
    tavernCoins: 1,
    tavernUnlocked: false,

    // ========== MINAS ==========
    minesMapUnlocked: true,
    lastMineReward: null,

    // ========== TIEMPO ==========
    timeOfDay: "day",
    dayCount: 1,
    timeProgress: 0,
    hour: 9,

    // ========== ECONOMÍA SECUNDARIA ==========
    // silver: Moneda secundaria (taberna, apuestas) — TODO
    thiefRisk: 0,               // Riesgo de evento ladrón (0-10)
    hasTriggeredGoldThief: false, // Si ya ocurrió el primer evento ladrón

    // ========== INVENTARIO ==========
    inventory: [],

    // ========== COMBATE ==========
    hp: 10,
    maxHp: 10,
    isInCombat: false,
    combatResolved: false,

    // ========== ESTADÍSTICAS HISTÓRICAS ==========
    totalGoldEarned: 0,
    totalGoldSpent: 0,
    totalClicks: 0,
    totalRepairs: 0,
    totalRefills: 0,

    // ========== TUTORIAL ==========
    tutorial: {
        completed: false,
        currentStep: 0,         // 0=oro, 1=stamina, 2=pico, 3=completado
        staminaUnlocked: false,
        pickaxeUnlocked: false,
        minesUnlocked: false,
        goldPerSecondBought: false
    },
};

export default InitialGameState;