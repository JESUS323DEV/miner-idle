/**
 * Configuración de todos los snacks.
 * 
 * Define costes, duraciones, efectos por nivel.
 */

export const SnacksConfig = {
    cookie: {
        name: "🍪 Galleta",

        unlock: {
            cost: 5  // Monedas taberna para desbloquear
        },

        upgrade: {
            level2: 10,  // Monedas para mejorar a lvl 2
            level3: 15   // Monedas para mejorar a lvl 3
        },

        use: {
            cost: 1  // Monedas para usar (cada vez)
        },

        effects: {
            level1: {
                goldPerSecond: { min: 1, max: 2 },  // RNG
                duration: 90,  // 1.5 min en segundos
                bonus: null    // Sin bonus
            },
            level2: {
                goldPerSecond: { min: 2, max: 3 },
                duration: 150,  // 2.5 min
                bonus: null
            },
            level3: {
                goldPerSecond: 3,  // Fijo
                duration: 210,  // 3.5 min
                bonus: {
                    type: "random",  // RNG entre 2 opciones
                    options: ["refillStamina", "repairPickaxe"],
                    chance: 0.5  // 50/50
                }
            }
        }
    },

    drink: {
        name: "🥤 Bebida",
        unlock: { cost: 5 },
        upgrade: { level2: 10, level3: 15 },
        use: { cost: 1 },
        effects: {
            // TODO: Definir después
        }
    },

    cake: {
        name: "🍰 Pastel",
        unlock: { cost: 5 },
        upgrade: { level2: 10, level3: 15 },
        use: { cost: 1 },
        effects: {
            // TODO: Definir después
        }
    }
};