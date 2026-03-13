/**
 * ARCHIVO: InitialGameState.js
 * 
 * Estado principal del juego.
 * Contiene TODAS las variables globales que no están en sub-estados específicos.
 * 
 * ORGANIZACIÓN:
 * - Oro y producción
 * - Materiales (bronce, hierro, diamante)
 * - Stamina y sistema de energía
 * - Buffs y snacks
 * - Ciclo día/noche
 * - Monedas secundarias (plata)
 * - Sistema de eventos (thiefRisk)
 * - Inventario
 * - Combate
 * 
 * SUB-ESTADOS SEPARADOS (importados en GameRoot):
 * - lady: InitialLadyState
 * - pickaxe: InitialPickaxeState
 * - combat: InitialCombatState (parcialmente, hp/maxHp están aquí por simplicidad)
 */

// ========== ORO Y PRODUCCIÓN ==========

/**
 * gold: Oro actual del jugador
 * - Moneda principal del juego
 * - Se usa para: upgrades, snacks, desbloqueos, reparaciones
 * - Se gana con: minado manual, minado automático, oro pasivo
 * 
 * NOTA TEMPORAL: 10000 oro inicial para testing
 * Cambiar a 0 o 50 en producción
 */

/**
* goldPerSecond: Oro pasivo que ganas cada segundo
* - 0 = Sin upgrades (no ganas oro pasivo)
* - Se incrementa comprando el upgrade "Oro por segundo"
* - Modificado por: hunger de Lady, buffs de snacks, eventos
* 
* MECÁNICA:
* - useGoldPerSecond hook suma este valor cada 1000ms
* - Si Lady.hunger < 50% → override a +1 oro/seg (penalización)
*/

/**
   * goldPerMine: Oro que ganas por cada picada (manual o auto)
   * - 5 = Pico de piedra básico
   * - Aumenta al mejorar material del pico:
   *   - Stone: 5 oro
   *   - Bronze: 8 oro
   *   - Metal: 12 oro
   *   - Diamond: 20 oro
   */


/**
 * passiveGoldBuffs: Modificador de oro pasivo (buffs temporales)
 * - 0 = Sin buffs
 * - Puede usarse para eventos especiales, powerups, etc.
 * 
 * TODO: Posiblemente redundante con goldBuffSnack
 * Revisar si se puede unificar
 */

/**
* goldBuffSnack: Modificador de oro por snack de productividad
* - 0 = Sin buff activo
* - > 0 = Multiplicador de oro (ej: 2 = x2 oro)
* 
* MECÁNICA:
* - Se activa al dar Productivity Snack a Lady
* - Dura X minutos (verificado con buffUntil timestamp)
* - Afecta oro/segundo y oro/mina
*/

// ========== MATERIALES (PARA UPGRADES DE PICO) ==========

/**
 * bronze: Bronce acumulado
 * - Se usa para: Mejorar pico de stone → bronze
 * - Se obtiene minando la mena de bronce (cuando se implemente)
 * 
 * NOTA TEMPORAL: 20 bronce inicial para testing
 * Cambiar a 0 en producción
 */


/**
 * iron: Hierro acumulado
 * - Se usa para: Mejorar pico de bronze → metal
 * - Se obtiene minando la mena de hierro
 * 
 * NOTA TEMPORAL: 50 hierro inicial para testing
 */


/**
 * diamond: Diamantes acumulados
 * - Se usa para: Mejorar pico de metal → diamond
 * - Se obtiene minando la mena de diamante
 * 
 * NOTA TEMPORAL: 10 diamantes iniciales para testing
 */

// ========== SISTEMA DE UPGRADES: ORO POR SEGUNDO ==========

/**
 * goldPerSecondLevel: Nivel de mejora de oro/segundo
 * - 0 = No comprado (goldPerSecond = 0)
 * - 1+ = Cada nivel suma +1 oro/segundo
 * 
 * USO:
 * - Mostrar en UI: "x4" si nivel 4
 * - Tracking de progresión
 */

/**
* goldPerSecondCost: Coste actual del upgrade
* - 100 oro para la primera compra
* - Aumenta progresivamente con cada compra
*/
/**
  * goldPerSecondCostIncrease: Cuánto sube el coste con cada compra
  * - +150 oro por nivel
  * 
  * PROGRESIÓN:
  * - Nivel 1: 100 oro
  * - Nivel 2: 250 oro
  * - Nivel 3: 400 oro
  * - Nivel 4: 550 oro
  * - etc.
  */

// ========== STAMINA (ENERGÍA PARA MINAR) ==========

/**
 * stamina: Stamina actual del jugador
 * - Necesaria para minar (manual o automático)
 * - Cada picada consume 1 stamina
 * - Cuando llega a 0 → No puedes minar
 */

/**
 * maxStamina: Stamina máxima
 * - Límite superior de stamina
 * - Se incrementa comprando el upgrade "Max Stamina"
 * - Cada upgrade suma +5 stamina máxima
 */
/**
   * staminaCostPerSecond: Stamina consumida por segundo (auto-minar)
   * - Actualmente no se usa (consumo es por picada, no por tiempo)
   * 
   * TODO: Evaluar si se necesita o eliminar
   */

/**
     * maxStaminaBuffs: Buffs temporales de stamina máxima
     * - 0 = Sin buffs
     * - Puede usarse para eventos/powerups que aumenten stamina temporalmente
     * 
     * TODO: Posiblemente no implementado, revisar
     */
/**
    * staminaBuffs: Buffs temporales de stamina actual
    * - 0 = Sin buffs
    * 
    * TODO: Posiblemente no implementado, revisar
    */

/**
   * staminaBuffSnack: Modificador de stamina por snack
   * - 0 = Sin buff
   * - Posible efecto: Reduce consumo de stamina al minar
   * 
   * TODO: Definir mecánica exacta
   */
// ========== SISTEMA DE UPGRADES: MAX STAMINA ==========

/**
 * maxStaminaLevel: Nivel de mejora de stamina máxima
 * - 0 = Sin upgrades (10 stamina)
 * - 1+ = Cada nivel suma +5 stamina máxima
 * 
 * USO:
 * - Mostrar en UI: "lvl 3" si nivel 3
 */

/**
    * maxStaminaCost: Coste actual del upgrade
    * - 500 oro para la primera compra
    */
/**
    * maxStaminaCostIncrease: Cuánto sube el coste con cada compra
    * - +500 oro por nivel
    * 
    * PROGRESIÓN:
    * - Nivel 1: 500 oro
    * - Nivel 2: 1000 oro
    * - Nivel 3: 1500 oro
    * - etc.
    */
// ========== SISTEMA DE RECARGA DE STAMINA ==========

/**
 * staminaRefillCost: Coste de recargar stamina al máximo
 * - 30 oro inicial
 * - NO aumenta con cada recarga (solo al mejorar maxStamina)
 * 
 * MECÁNICA:
 * - Restaura stamina a maxStamina instantáneamente
 * - El coste sube +10 oro cada vez que compras upgrade de maxStamina
 */

/**
 * staminaRefillCostIncrease: Cuánto sube el coste al mejorar maxStamina
 * - +15 oro por cada nivel de maxStamina comprado
 * 
 * NOTA: Ya no se usa para aumentar con cada recarga
 * Solo informativo de cuánto sube al comprar upgrade
 */



/**
 * snackLevel: Nivel de mejora de snacks
 * - 0 = Sin mejoras
 * 
 * TODO: Definir si es nivel global o por snack individual
 */
/**
     * isMining: Si el auto-minado está activo
     * - false = Detenido
     * - true = Minando automáticamente
     * 
     * MECÁNICA:
     * - useAutoMining hook verifica este valor
     * - Si true → ejecuta handleMine cada 500ms
     * - Se auto-desactiva si stamina o durabilidad llegan a 0
     */

// ========== CICLO DÍA/NOCHE ==========

/**
 * timeOfDay: Momento del día actual
 * - "day" = Día (puedes ir a la taberna, minar normalmente)
 * - "night" = Noche (eventos nocturnos, posible ataque de ladrón)
 * 
 * MECÁNICA:
 * - Cambia automáticamente según timeProgress o hour
 * - Afecta qué eventos pueden aparecer
 * - Puede afectar producción de oro (ej: -50% de noche)
 */
/**
 * dayCount: Contador de días transcurridos
 * - 1 = Primer día
 * - Se incrementa cada vez que completas un ciclo día/noche
 * 
 * USO:
 * - Tracking de progreso
 * - Puede afectar dificultad de enemigos
 * - Achievements ("Sobrevive 30 días")
 */

/**
   * timeProgress: Progreso del tiempo dentro del día (0-100%)
   * - 0 = Inicio del día
   * - 100 = Fin del día (cambia a noche o siguiente día)
   * 
   * MECÁNICA:
   * - Puede aumentar con el tiempo real
   * - O aumentar con acciones del jugador
   * - Cuando llega a 100 → dayCount++, timeProgress = 0
   * 
   *    // ========== HORA DEL DÍA ==========

    /**
     * hour: Hora actual del día (0-23)
     * - 9 = 9:00 AM (hora inicial)
     * - Se incrementa con el tiempo
     * 
     * USOS:
     * - Determina si la taberna está abierta (9-20h)
     * - Afecta qué eventos pueden aparecer
     * - Puede afectar precios/bonificaciones
     * 
     * RELACIÓN CON timeOfDay:
     * - hour 6-18 → "day"
     * - hour 19-5 → "night"
     */
// ========== MONEDAS SECUNDARIAS ==========

/**
 * silver: Plata acumulada
 * - Moneda secundaria del juego
 * - Se usa en: Taberna (apuestas, compras especiales)
 * - Se obtiene con: Eventos de taberna, venta de materiales
 * 
 * PROPÓSITO:
 * - Economía separada del oro
 * - Permite tomar riesgos sin afectar progreso principal
 * - Puede intercambiarse por oro en taberna (ratio desfavorable)
 */


// ========== SISTEMA DE EVENTOS: LADRÓN ==========

/**
 * thiefRisk: Nivel de riesgo acumulado de que aparezca el ladrón
 * - 0 = Sin riesgo
 * - Cada rechazo de evento de taberna suma 
 * - A mayor valor, mayor probabilidad de evento nocturno
 * 
 * MECÁNICA:
 * - Rechazas apuesta en taberna → thiefRisk++
 * - Por la noche: Math.random() < (thiefRisk * 0.1) → Aparece ladrón
 * - Si aparece → thiefRisk se resetea (o reduce)
 * 
 * EJEMPLO:
 * - thiefRisk = 3 → 30% probabilidad de ladrón esa noche
 * - thiefRisk = 7 → 70% probabilidad
 */

/**
  * hasTriggeredGoldThief: Si ya ocurrió el primer evento del ladrón
  * - false = Primer evento garantizado (tutorial)
  * - true = Eventos futuros son RNG según thiefRisk
  * 
  * MECÁNICA:
  * - Primera noche con oro > 5000 → Ladrón aparece 100%
  * - hasTriggeredGoldThief = true
  * - Noches siguientes → probabilidad según thiefRisk
  */
// ========== INVENTARIO ==========

/**
 * inventory: Array de items del jugador
 * - [] = Vacío al inicio
 * - Estructura: [{ id: "health_potion", quantity: 3 }, ...]
 * 
 * POSIBLES ITEMS:
 * - Pociones de vida (para combate)
 * - Materiales especiales (para crafteo)
 * - Llaves (para desbloquear áreas)
 * - Snacks (alternativa a comprarlos directamente)
 * 
 * USO:
 * - Se muestra en un modal de inventario
 * - Se consume en combate o eventos
 */

// ========== SISTEMA DE COMBATE ==========

/**
 * hp: Vida actual del jugador
 * - 10 HP inicial
 * - Necesaria para combates
 * - Si llega a 0 → Pierdes el combate
 * 
 * NOTA: Está aquí en vez de en combat.playerStats
 * por simplicidad (puede moverse en refactor futuro)
 */

/**
 * maxHp: Vida máxima del jugador
 * - 10 HP inicial
 * - Puede aumentar con upgrades/items
 */

/**
    * isInCombat: Si hay un combate activo
    * - false = Gameplay normal
    * - true = Pantalla de combate
    * 
    * NOTA: Duplicado con combat.isActive
    * TODO: Unificar en combat state
    */
/**
   * combatResolved: Si el combate actual ya terminó
   * - false = Combate en progreso
   * - true = Combate terminado (ganado o perdido)
   * 
   * USO:
   * - Evita ejecutar lógica de combate múltiples veces
   * - Se resetea al salir de la pantalla de combate
   */

import initialSnacksState from "./snacksGold/initialSnacksState.js";
const InitialGameState = {

    // ========== ORO ==========
    gold: 3510,
    goldPerSecond: 0,
    passiveGoldBuffs: 0,
    goldBuffSnack: 0,
    goldPerSecondLevel: 0,
    goldPerSecondCost: 500,
    goldPerSecondCostIncrease: 1500,

    // ========== MATERIALES ==========
    bronze: 0,
    iron: 0,
    diamond: 0,

    // ========== STAMINA ==========
    stamina: 15,                        // Stamina actual
    maxStamina: 15,                     // Stamina máxima actual
    staminaCostPerSecond: 1,            // Stamina que consume por segundo al minar
    maxStaminaLevel: 0,                 // Nivel actual de mejora de stamina máxima
    maxStaminaCost: 500,                // Coste inicial de mejorar stamina máxima
    maxStaminaCostIncrease: 5000,       // Cuánto sube el coste cada mejora
    maxStaminaBuffs: 0,                 // Máximo de buffs de stamina aplicables
    staminaBuffs: 0,                    // Buffs de stamina activos actualmente
    staminaBuffSnack: 0,                // Buff de stamina por snack activo
    staminaRefillCost: 30,             // Coste inicial de recargar stamina
    staminaRefillCostIncrease: 1000,      // Cuánto sube el coste de recarga cada mejora
    staminaRefillCount: 0,              // Veces que has recargado stamina

    // ========== SNACKS ==========
    snackBuffHasta: null,
    snackLevel: 0,

    // ========== MINADO ==========
    isMining: false,

    // ========== COMBOS POR CLICK EN MENA DE ORO ==========
    comboCount: 0,           // Combo actual
    maxComboEver: 0,         // Mejor combo histórico
    lastClickTime: null,     // Timestamp último click

    // ========== TIEMPO ==========
    timeOfDay: "day",
    dayCount: 1,
    timeProgress: 0,
    hour: 9,

    // ========== OTROS ==========
    //=====moneda tavern
    tavernCoins: 1,
    thiefRisk: 0,
    hasTriggeredGoldThief: false,
    snacks: initialSnacksState,

    // ========== INVENTARIO ==========
    inventory: [],

    // ========== COMBATE ==========
    hp: 10,
    maxHp: 10,
    isInCombat: false,
    combatResolved: false,

    // ========== TUTORIAL ==========
    tutorial: {
        completed: false,
        currentStep: 0,  // 0=oro, 1=stamina, 2=pico, 3=completado
        staminaUnlocked: false,
        pickaxeUnlocked: false,
        minesUnlocked: false,
        goldPerSecondBought: false  // Para verificar que compró en paso 1
    },

    // ✅ DESPUÉS:
    automine: {
        unlocked: false,
        maxCharges: 2,
        charges: [
            { available: true, cooldownUntil: null },  // Carga 1
            { available: true, cooldownUntil: null }   // Carga 2
        ],
        isActive: false
    },

    // ========== COMBOS POR CLICK EN MENA DE ORO ==========
    comboCount: 0,
    maxComboEver: 0,
    lastClickTime: null,
    lastComboBonus: 0,

    comboMilestones: {
        20: false,
        25: false,
        30: false,
        35: false,
        40: false,
        45: false,
        50: false,
        55: false,
        60: false,
        65: false,
        70: false
    },

    //=================
    tavernUnlocked: false,
    minesMapUnlocked: true,
    lastMineReward: null,

    //===============
    forgeUnlocked: true,
    bronzeIngot: 10,
    ironIngot: 0,
    diamondIngot: 0,
    //===================
    furnaces: {
        bronze: { unlocked: false, level: 1, isActive: false, progress: 0, startTime: null, pendingIngots: 0 },
        iron: { unlocked: false, level: 1, isActive: false, progress: 0, startTime: null, pendingIngots: 0 },
        diamond: { unlocked: false, level: 1, isActive: false, progress: 0, startTime: null, pendingIngots: 0 },
    },

    //===============
    totalGoldEarned: 0,
    totalGoldSpent: 0,
    totalClicks: 0,
    totalRepairs: 0,
    totalRefills: 0,
};

export default InitialGameState;