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

    /**
     * unlockedTypes: Array de tipos de minas que el jugador ha desbloqueado
     * - ["gold"] = Solo oro disponible (inicio)
     * - ["gold", "bronze"] = Oro y bronce desbloqueados
     * - ["gold", "bronze", "iron", "diamond"] = Todo desbloqueado
     * 
     * USO:
     * - Determina qué tipos pueden aparecer en activeMines
     * - Muestra en UI qué minas puede desbloquear
     */
    unlockedTypes: ["gold"],  // Solo oro desbloqueado al inicio

    // ===== MINAS ACTIVAS (disponibles en el mapa ahora) =====


    activeMines: [],  // Vacío al inicio (se generan con timer)

    // ===== MINA ACTUAL (si está dentro de una) =====

    /**
     * currentMine: Si el jugador está dentro de una mina, guarda su estado
     * - null = No está en ninguna mina (pantalla principal)
     * - Object = Está dentro de una mina específica
     * 
     * ESTRUCTURA:
     * {
     *   mineId: "bronze_1708123456789",    // ID de la mina activa
     *   veins: [...],                       // Estado actual de las menas
     *   resourcesGathered: {                // Materiales minados hasta ahora
     *     bronze: 25,
     *     iron: 0,
     *     diamond: 0
     *   },
     *   clicksCount: 47,                    // Clicks totales en esta mina
     *   enteredAt: 1708123500000,           // Timestamp de cuándo entró
     *   eventsTriggered: ["rich_vein"]      // IDs de eventos ya activados
     * }
     * 
     * USO:
     * - Cuando entras a mina → Se copia desde activeMines
     * - Cuando sales → Se vuelve null
     * - Cuando completas → Se marca como completada en activeMines
     */
    currentMine: null,  // No está en ninguna mina al inicio

    // ===== HISTORIAL Y STATS =====

    /**
     * completedMines: Array de IDs de minas completadas
     * - ["bronze_1708123456789", "iron_1708234567890", ...]
     * - Solo para tracking/stats
     * 
     * USO:
     * - Achievements ("Completa 50 minas")
     * - Stats en UI ("Has completado X minas de bronce")
     */
    completedMines: [],
    
    unlockedBiomes: ['bronze'],
    bronzeFirstEntryDone: false,
    /**
     * totalMinesCompleted: Contador total de minas completadas
     * - Número simple para stats rápidos
     */
    totalMinesCompleted: 0,

    /**
     * stats: Estadísticas por tipo de mina
     * - Cuántas has completado de cada tipo
     * - Total de materiales obtenidos
     * 
     * ESTRUCTURA:
     * {
     *   bronze: { completed: 5, totalGathered: 120 },
     *   iron: { completed: 2, totalGathered: 45 },
     *   diamond: { completed: 0, totalGathered: 0 }
     * }
     */
    stats: {
        bronze: { completed: 0, totalGathered: 0 },
        iron: { completed: 0, totalGathered: 0 },
        diamond: { completed: 0, totalGathered: 0 }
    },

    // ✅ NUEVO: Tracking de mejor puntuación por mina
    bestScores: {
        bronze: 0,      // Estrellas conseguidas (0-3)
        iron: 0,
        diamond: 0,
        bronze_lvl2: 0,
        iron_lvl2: 0,
        diamond_lvl2: 0,
        bronze_lvl3: 0,
        iron_lvl3: 0,
        diamond_lvl3: 0,
    },

    activeMines: [],
    currentMine: null,
    completedMines: [],
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
    }
};

export default initialMinesState;