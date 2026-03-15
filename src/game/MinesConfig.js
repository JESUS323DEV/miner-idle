const MinesConfig = {

    // ===== MINA DE ORO (SIEMPRE DISPONIBLE) =====
    gold: {
        type: "gold",
        name: "Mina de Oro",
        description: "La mina principal, siempre disponible",
    },

    //  ======================================BRONCE LVL 1 =====
    bronze: {
        type: "bronze",
        name: "Mina de Bronce",
        color: "#CD7F32",

        unlockCost: 2000,
        entryCost: 2000,

        baseVeinsCount: { min: 2, max: 2 },
        baseVeinCapacity: { min: 40, max: 40 },

        //MATERIALES OBTENIDOS AL MINAR CADA MINA
        yields: {
            stone: { min: 1, max: 3 },
            bronze: { min: 4, max: 6 },
            metal: { min: 9, max: 12 },
            diamond: { min: 10, max: 15 },
        },

        // ESTRELLAS — thresholds de materiales recogidos al completar
        starThresholds: { perfect: 200, good: 100 },
        // BONUS — multiplicador de materiales al completar con estrellas
        starBonuses: { perfect: 0.5, good: 0.25 },

        possibleEvents: ["bronze_merchant", "rich_vein", "cave_in", "beggar_miner"],
        eventChance: 0.15,
    },


    //  ======================================BRONCE LVL 2 =====
    bronze_lvl2: {
        type: "bronze_lvl2",
        name: "Mina de Bronce II",
        color: "#CD7F32",

        unlockCost: 4000,
        entryCost: 6000,
        requiresStars: { mineType: 'bronze', stars: 2 },

        baseVeinsCount: { min: 4, max: 5 },
        baseVeinCapacity: { min: 30, max: 30 },

        yields: {
            stone: { min: 0, max: 0 },
            bronze: { min: 5, max: 8 },
            metal: { min: 8, max: 10 },
            diamond: { min: 12, max: 14 },
        },

        // ESTRELLAS — thresholds de materiales recogidos al completar
        starThresholds: { perfect: 450, good: 300 },

        // BONUS — multiplicador de materiales al completar con estrellas
        starBonuses: { perfect: 0.5, good: 0.25 },
    },

    // ======================================BRONCE LVL 3 =====
    bronze_lvl3: {
        type: "bronze_lvl3",
        name: "Mina de Bronce III",
        color: "#CD7F32",

        unlockCost: 8000,
        entryCost: 8000,
        requiresStars: { mineType: 'bronze_lvl2', stars: 2 },

        baseVeinsCount: { min: 5, max: 6 },
        baseVeinCapacity: { min: 35, max: 35 },

        yields: {
            stone: { min: 0, max: 1 },
            bronze: { min: 1, max: 2 },
            metal: { min: 7, max: 10 },
            diamond: { min: 12, max: 15 },
        },

        // ESTRELLAS — thresholds de materiales recogidos al completar
        starThresholds: { perfect: 300, good: 200 },

        // BONUS — multiplicador de materiales al completar con estrellas
        starBonuses: { perfect: 0.5, good: 0.25 },
    },


    // ====================================== HIERRO LVL 1 =====
    iron: {
        type: "iron",
        name: "Mina de Hierro",
        color: "#808080",

        unlockCost: 8000,
        entryCost: 4000,

        baseVeinsCount: { min: 3, max: 3 },
        baseVeinCapacity: { min: 10, max: 10 },

        yields: {
            stone: { min: 0, max: 0 },
            bronze: { min: 0, max: 1 },
            metal: { min: 0, max: 2 },
            diamond: { min: 1, max: 4 },
        },

        starThresholds: { perfect: 100, good: 50 },
        starBonuses: { perfect: 0.5, good: 0.25 },

        possibleEvents: ["iron_blueprint", "lost_miner", "rich_vein", "cave_in", "tool_break"],
        eventChance: 0.20,
    },

    // ===== DIAMANTE LVL 1 =====
    diamond: {
        type: "diamond",
        name: "Mina de Diamante",
        color: "#B9F2FF",

        unlockCost: 12000,
        entryCost: 6000,

        baseVeinsCount: { min: 2, max: 2 },
        baseVeinCapacity: { min: 10, max: 10 },

        yields: {
            stone: { min: 0, max: 0 },
            bronze: { min: 0, max: 0 },
            metal: { min: 0, max: 1 },
            diamond: { min: 1, max: 3 },
        },

        starThresholds: { perfect: 100, good: 50 },
        starBonuses: { perfect: 0.5, good: 0.25 },

        possibleEvents: ["guardian_creature", "cursed_mine", "blessed_vein", "treasure_map", "ancient_tool"],
        eventChance: 0.30,
    },

    // ===== HIERRO LVL 2 =====
    iron_lvl2: {
        type: "iron_lvl2",
        name: "Mina de Hierro II",
        color: "#808080",

        unlockCost: 12000,
        entryCost: 8000,
        requiresStars: { mineType: 'iron', stars: 2 },

        baseVeinsCount: { min: 2, max: 4 },
        baseVeinCapacity: { min: 20, max: 30 },

        yields: {
            stone: { min: 0, max: 0 },
            bronze: { min: 0, max: 1 },
            metal: { min: 0, max: 2 },
            diamond: { min: 1, max: 4 },
        },

        starThresholds: { perfect: 200, good: 150 },
        starBonuses: { perfect: 0.5, good: 0.25 },
    },

    // ===== DIAMANTE LVL 2 =====
    diamond_lvl2: {
        type: "diamond_lvl2",
        name: "Mina de Diamante II",
        color: "#B9F2FF",

        unlockCost: 16000,
        entryCost: 10000,
        requiresStars: { mineType: 'diamond', stars: 2 },

        baseVeinsCount: { min: 2, max: 4 },
        baseVeinCapacity: { min: 20, max: 30 },

        yields: {
            stone: { min: 0, max: 0 },
            bronze: { min: 0, max: 0 },
            metal: { min: 0, max: 1 },
            diamond: { min: 1, max: 3 },
        },

        starThresholds: { perfect: 200, good: 150 },
        starBonuses: { perfect: 0.5, good: 0.25 },
    },



    // ===== HIERRO LVL 3 =====
    iron_lvl3: {
        type: "iron_lvl3",
        name: "Mina de Hierro III",
        color: "#808080",

        unlockCost: 16000,
        entryCost: 10000,
        requiresStars: { mineType: 'iron', stars: 3 },

        baseVeinsCount: { min: 5, max: 5 },
        baseVeinCapacity: { min: 20, max: 20 },

        yields: {
            stone: { min: 0, max: 0 },
            bronze: { min: 0, max: 1 },
            metal: { min: 0, max: 2 },
            diamond: { min: 1, max: 4 },
        },

        starThresholds: { perfect: 300, good: 200 },
        starBonuses: { perfect: 0.5, good: 0.25 },
    },

    // ===== DIAMANTE LVL 3 =====
    diamond_lvl3: {
        type: "diamond_lvl3",
        name: "Mina de Diamante III",
        color: "#B9F2FF",

        unlockCost: 20000,
        entryCost: 12000,
        requiresStars: { mineType: 'diamond', stars: 3 },

        baseVeinsCount: { min: 5, max: 5 },
        baseVeinCapacity: { min: 20, max: 20 },

        yields: {
            stone: { min: 0, max: 0 },
            bronze: { min: 0, max: 0 },
            metal: { min: 0, max: 1 },
            diamond: { min: 1, max: 3 },
        },

        starThresholds: { perfect: 300, good: 200 },
        starBonuses: { perfect: 0.5, good: 0.25 },
    },
};

export default MinesConfig;