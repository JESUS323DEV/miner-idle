/**
 * ARCHIVO: InitialMinesConfig.js
 * 
 * Configuración de TIPOS de minas (plantillas).
 * 
 * Este archivo NO se modifica durante el juego.
 * Define las características base de cada tipo de mina.
 * 
 * PROPÓSITO:
 * - Plantillas para generar minas aleatorias
 * - Características fijas (yields, costes base, etc.)
 * - Escalable: Añadir nuevos tipos es solo añadir un objeto
 * 
 * USO:
 * Cuando generas una nueva mina activa, usas estos valores base
 * y añades variación aleatoria (ej: entryCost ± 20%)
 */

const MinesConfig = {

    // ===== MINA DE ORO (SIEMPRE DISPONIBLE) =====

    /**
     * gold: Mina de oro principal
     * - No es parte del sistema de minas aleatorias
     * - Siempre visible en pantalla principal
     * - No tiene instancias ni rotación
     */
    gold: {
        type: "gold",
        name: "Mina de Oro",
        description: "La mina principal, siempre disponible",
        // No tiene yields ni costes (usa sistema diferente)
    },

    // ===== MINA DE BRONCE  LVL 1=====


    bronze: {
        type: "bronze",
        name: "Mina de Bronce",
        color: "#CD7F32",  // Color para UI

        // DESBLOQUEO
        unlockCost: 1000,  // Oro necesario para desbloquear este TIPO

        // RECURSOS DENTRO (BASE para instancias)
        baseVeinsCount: { min: 3, max: 3 },      // 5 menas por mina en lvl 1
        baseVeinCapacity: { min: 20, max: 20 },  //  clicks por mena

        // YIELDS (según material del pico)
        yields: {
            stone: { min: 0, max: 1 },
            bronze: { min: 1, max: 2 },
            metal: { min: 1, max: 3 },

            diamond: { min: 3, max: 5 }
        },

        // EVENTOS POSIBLES (IDs de MineEvents.js)
        possibleEvents: [
            "bronze_merchant",
            "rich_vein",
            "cave_in",
            "beggar_miner"
        ],
        eventChance: 0.15,  // 15% prob por cada 5 clicks


    },

    // ===== MINA DE HIERRO LVL 1=====


    /* iron: Plantilla para minas de hierro*/


    iron: {
        type: "iron",
        name: "Mina de Hierro",
        color: "#808080",

        unlockCost: 4000,



        baseVeinsCount: { min: 3, max: 3 },
        baseVeinCapacity: { min: 10, max: 10 },

        yields: {
            stone: { min: 0, max: 0 },
            bronze: { min: 0, max: 1 },
            metal: { min: 0, max: 2 },
            diamond: { min: 1, max: 4 }
        },

        possibleEvents: [
            "iron_blueprint",
            "lost_miner",
            "rich_vein",
            "cave_in",
            "tool_break"
        ],
        eventChance: 0.20,  // 20% (más eventos que bronce)


    },

    // ===== MINA DE DIAMANTE LVL 1=====

    /**
     * diamond: Plantilla para minas de diamante
     * 
     * CARACTERÍSTICAS:
     * - Mina endgame
     * - Coste de entrada alto
     * - Yields muy difíciles (requiere pico de diamante)
     * - Eventos de combate/riesgo alto
     */
    diamond: {
        type: "diamond",
        name: "Mina de Diamante",
        color: "#B9F2FF",

        unlockCost: 6000,


        baseVeinsCount: { min: 2, max: 2 },  // Menos menas
        baseVeinCapacity: { min: 10, max: 10 }, // VIDA DE MENAS

        yields: {
            stone: { min: 0, max: 0 },   // Imposible
            bronze: { min: 0, max: 0 },  // Imposible
            metal: { min: 0, max: 1 },   // Difícil
            diamond: { min: 1, max: 3 }  // Viable
        },

        possibleEvents: [
            "guardian_creature",
            "cursed_mine",
            "blessed_vein",
            "treasure_map",
            "ancient_tool"
        ],
        eventChance: 0.30,  // 30% (muchos eventos, alto riesgo)


    },

    // ===== EXPANDIR FÁCILMENTE =====
    //
    // Para añadir nuevos tipos de minas, solo copia el patrón:
    //
    // platinum: {
    //     type: "platinum",
    //     name: "Mina de Platino",
    //     color: "#E5E4E2",
    //     unlockCost: 500000,
    //     baseEntryCost: 50000,
    //     entryCostVariation: 0.5,
    //     baseVeinsCount: { min: 2, max: 4 },
    //     baseVeinCapacity: { min: 30, max: 50 },
    //     yields: { ... },
    //     possibleEvents: [...],
    //     eventChance: 0.35,
    //     respawnTime: 10800000,
    //     expirationTime: 21600000
    // }

    //==============================================================================================

    bronze_lvl2: {
        type: "bronze_lvl2",
        name: "Mina de Bronce II",
        color: "#CD7F32",

        unlockCost: 4000,
        requiresStars: { mineType: 'bronze', stars: 2 },  // ✅ Requiere 2 estrellas en bronze lvl1
        baseEntryCost: 0,

        baseVeinsCount: { min: 4, max: 5 },
        baseVeinCapacity: { min: 20, max: 20 },  // Más vida que lvl1

        yields: {
            stone: { min: 0, max: 1 },
            bronze: { min: 1, max: 2 },
            metal: { min: 1, max: 3 },

            diamond: { min: 3, max: 5 }
        }
    },

    iron_lvl2: {
        type: "iron_lvl2",
        name: "Mina de Hierro II",
        color: "#808080",
        unlockCost: 6000,
        requiresStars: { mineType: 'iron', stars: 2 },

        baseVeinsCount: { min: 2, max: 4 },
        baseVeinCapacity: { min: 20, max: 30 },
        yields: {
            stone: { min: 0, max: 0 },
            bronze: { min: 0, max: 1 },
            metal: { min: 0, max: 2 },
            diamond: { min: 1, max: 4 }
        }
    },

    diamond_lvl2: {
        type: "diamond_lvl2",
        name: "Mina de Diamante II",
        color: "#B9F2FF",
        unlockCost: 8000,
        requiresStars: { mineType: 'diamond', stars: 2 },

        baseVeinsCount: { min: 2, max: 4 },
        baseVeinCapacity: { min: 20, max: 30 },
        yields: {
            stone: { min: 0, max: 0 },   // Imposible
            bronze: { min: 0, max: 0 },  // Imposible
            metal: { min: 0, max: 1 },   // Difícil
            diamond: { min: 1, max: 3 }  // Viable
        }
    },

    //========================================================================

    bronze_lvl3: {
        type: "bronze_lvl3",
        name: "Mina de Bronce III",
        color: "#CD7F32",
        unlockCost: 6000,
        requiresStars: { mineType: 'bronze', stars: 3 },  // ✅ Requiere 3⭐ en lvl2
        baseVeinsCount: { min: 5, max: 5 },
        baseVeinCapacity: { min: 20, max: 20 },
        yields: {
            stone: { min: 0, max: 1 },
            bronze: { min: 1, max: 2 },
            metal: { min: 1, max: 3 },

            diamond: { min: 3, max: 5 }
        }
    },

    iron_lvl3: {
        type: "iron_lvl3",
        name: "Mina de Hierro III",
        color: "#808080",
        unlockCost: 8000,
        requiresStars: { mineType: 'iron', stars: 3 },
        baseVeinsCount: { min: 5, max: 5 },
        baseVeinCapacity: { min: 20, max: 20 },
        yields: {
            stone: { min: 0, max: 0 },
            bronze: { min: 0, max: 1 },
            metal: { min: 0, max: 2 },
            diamond: { min: 1, max: 4 }
        }
    },

    diamond_lvl3: {
        type: "diamond_lvl3",
        name: "Mina de Diamante III",
        color: "#B9F2FF",
        unlockCost: 10000,
        requiresStars: { mineType: 'diamond', stars: 3 },
        baseVeinsCount: { min: 5, max: 5 },
        baseVeinCapacity: { min: 20, max: 20 },
        yields: {
            stone: { min: 0, max: 0 },   // Imposible
            bronze: { min: 0, max: 0 },  // Imposible
            metal: { min: 0, max: 1 },   // Difícil
            diamond: { min: 1, max: 3 }  // Viable
        }
    }

};

export default MinesConfig;