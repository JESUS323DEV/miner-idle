// ============================================================
// RaidConfig.js — Configuración de raids
// ============================================================
// PASIVAS: el jugador envía un equipo, espera un tiempo y reclama loot.
// ACTIVAS (TODO): clicker en tiempo real contra un enemigo.
//
// Loot:
//   - chance: probabilidad (0-100) de que ese recurso aparezca
//   - min/max: cantidad base (escala con fuerza del equipo)
//   - fragments: cada perro enviado tira su propia probabilidad
//     y genera fragmentos de sí mismo si sale
// ============================================================

import { DogsConfig } from './DogsConfig.js';

export const RaidConfig = {

    // ===== RAIDS PASIVAS =====
    passiveRaids: [
        {
            id: 'forest',
            name: 'Bosque Antiguo',
            emoji: '🌲',
            description: 'Recursos básicos y fragmentos de tus perros.',
            duration: 120,          // segundos
            difficulty: 1,
            minTeam: 1,
            maxTeam: 3,
            loot: {
                gold:      { chance: 80, min: 300,  max: 1200 },
                fragments: { chance: 50, min: 5,    max: 15   },   // por perro
            },
        },
        {
            id: 'caves',
            name: 'Cavernas Oscuras',
            emoji: '🕳️',
            description: 'Más fragmentos y alguna moneda de taberna.',
            duration: 300,
            difficulty: 2,
            minTeam: 2,
            maxTeam: 3,
            loot: {
                gold:        { chance: 85, min: 1000, max: 4000 },
                fragments:   { chance: 65, min: 10,   max: 30   },  // por perro
                tavernCoins: { chance: 12, min: 1,    max: 1    },
            },
        },
        {
            id: 'volcano',
            name: 'Volcán de Diamantes',
            emoji: '🌋',
            description: 'Alta dificultad, grandes fragmentos y monedas.',
            duration: 600,
            difficulty: 4,
            minTeam: 3,
            maxTeam: 3,
            loot: {
                gold:        { chance: 90, min: 3000, max: 12000 },
                fragments:   { chance: 80, min: 20,   max: 60    },  // por perro
                tavernCoins: { chance: 35, min: 1,    max: 3     },
            },
        },
    ],

    // ===== RAIDS ACTIVAS (reservado) =====
    // activeRaids: [ ... ],
};

// Fuerza del equipo: suma del poder de minado × bonus estrellas, normalizada vs dificultad
export const calcTeamStrength = (dogIds, dogsState, difficulty) => {
    const totalPower = dogIds.reduce((sum, id) => {
        const dog = dogsState[id];
        if (!dog) return sum;
        const cfg = DogsConfig[id];
        if (!cfg) return sum;
        const starMulti = 1 + (dog.stars ?? 0) * 0.25;
        return sum + (cfg.miningPower ?? 1) * starMulti;
    }, 0);
    return Math.min(1, totalPower / (difficulty * 10));
};

// Genera loot a partir de la config de la raid y la fuerza del equipo.
// Fragmentos: cada perro enviado tira su propia probabilidad y obtiene
// fragmentos de sí mismo si tiene éxito.
export const generateRaidLoot = (raid, dogIds, dogsState) => {
    const strength = calcTeamStrength(dogIds, dogsState, raid.difficulty);
    const result = {};

    for (const [resource, cfg] of Object.entries(raid.loot)) {
        if (resource === 'fragments') {
            for (const dogId of dogIds) {
                if (Math.random() * 100 > cfg.chance) continue;
                const amount = Math.max(1, Math.round(
                    cfg.min + (cfg.max - cfg.min) * strength * (0.6 + Math.random() * 0.4)
                ));
                if (!result.fragments) result.fragments = [];
                result.fragments.push({ dogId, amount });
            }
        } else {
            if (Math.random() * 100 > cfg.chance) continue;
            const amount = Math.max(1, Math.round(
                cfg.min + (cfg.max - cfg.min) * strength * (0.6 + Math.random() * 0.4)
            ));
            result[resource] = amount;
        }
    }

    return result;
};
