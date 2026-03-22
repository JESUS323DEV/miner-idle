/**
 * ARCHIVO: InitialMinesState.js
 *
 * Estado del jugador relacionado con minas.
 * Este archivo SÍ cambia durante el juego (se guarda en localStorage).
 *
 * ESTRUCTURA:
 * - unlockedTypes: Qué tipos de minas ha desbloqueado
 * - activeMines: Minas actualmente disponibles en el mapa
 * - completedMines: Historia de minas completadas
 * - currentMine: Si está dentro de una mina, guarda su estado
 *
 * RELACIÓN CON MinesConfig:
 * - MinesConfig define las plantillas
 * - Este estado guarda instancias específicas generadas desde esas plantillas
 */

const initialMinesState = {

    // ===== TIPOS DESBLOQUEADOS =====
    unlockedTypes: ["gold"],  // Solo oro desbloqueado al inicio

    // ===== MINAS ACTIVAS (disponibles en el mapa ahora) =====
    activeMines: [],

    // ===== MINA ACTUAL (si está dentro de una) =====
    currentMine: null,

    // ===== HISTORIAL Y STATS =====
    completedMines: [],
    unlockedBiomes: [],
    bronzeFirstEntryDone: false,
    totalMinesCompleted: 0,

    stats: {
        bronze: { completed: 0, totalGathered: 0 },
        iron: { completed: 0, totalGathered: 0 },
        diamond: { completed: 0, totalGathered: 0 },
        bronze_lvl2: { completed: 0, totalGathered: 0 },
        iron_lvl2: { completed: 0, totalGathered: 0 },
        diamond_lvl2: { completed: 0, totalGathered: 0 },
        bronze_lvl3: { completed: 0, totalGathered: 0 },
        iron_lvl3: { completed: 0, totalGathered: 0 },
        diamond_lvl3: { completed: 0, totalGathered: 0 },
    },

    bestScores: {
        bronze: 0,
        iron: 0,
        diamond: 0,
        bronze_lvl2: 0,
        iron_lvl2: 0,
        diamond_lvl2: 0,
        bronze_lvl3: 0,
        iron_lvl3: 0,
        diamond_lvl3: 0,
    },
};

export default initialMinesState;
