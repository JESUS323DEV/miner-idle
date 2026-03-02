/**
 * ARCHIVO: InitialCombatState.js
 * 
 * Estado inicial del sistema de combate.
 * 
 * SISTEMA DE COMBATE:
 * El combate se activa cuando:
 * - Un ladrón aparece de noche y eliges luchar
 * - Eventos especiales que requieren pelea
 * - (Futuro) Encuentros aleatorios, raids, etc.
 * 
 * MECÁNICA:
 * - Combate por turnos (tú atacas → enemigo ataca → repite)
 * - Si ganas → Recompensas (oro, items, evitas robo)
 * - Si pierdes → Consecuencias (pierdes oro, items, etc.)
 * 
 * RELACIÓN CON STAMINA:
 * - Sin stamina → No puedes luchar (robo automático)
 * - Con stamina → Puedes defender tus recursos
 */

const InitialCombatState = {
    // ===== ESTADO DEL COMBATE =====

    /**
     * isActive: Si hay un combate activo en este momento
     * - false = Gameplay normal (minar, upgrades, etc.)
     * - true = Pantalla de combate activa
     * 
     * FLOW:
     * 1. Evento nocturno activa combate → isActive = true
     * 2. Cambias a pantalla de combate
     * 3. Peleas por turnos
     * 4. Termina combate → isActive = false
     * 5. Vuelves a gameplay normal
     * 
     * USO EN GAMEROOT:
     * - if (gameState.combat.isActive) → Renderiza <CombatScreen />
     * - else → Renderiza gameplay normal
     */
    isActive: false,

    // ===== INFORMACIÓN DEL ENEMIGO =====

    enemy: {
        /**
         * type: Tipo de enemigo actual
         * - null = No hay enemigo
         * - "thief" = Ladrón de la taberna
         * - "wolf" = Lobo salvaje (futuro)
         * - "bandit" = Bandido (futuro)
         * - "boss" = Jefe especial (futuro)
         * 
         * USO:
         * - Determina sprite/imagen del enemigo
         * - Determina recompensas al ganar
         * - Determina diálogos/textos
         * 
         * EJEMPLO:
         * - type: "thief" → Imagen de ladrón, texto "¡Devuélveme mi oro!"
         */
        type: null,

        /**
         * hp: Puntos de vida del enemigo
         * - 10 = HP inicial del ladrón básico
         * - Varía según el tipo de enemigo
         * 
         * MECÁNICA:
         * - Cada ataque tuyo le resta HP
         * - Cuando llega a 0 → Ganas el combate
         * 
         * ESCALADO (futuro):
         * - Enemigos más fuertes tienen más HP
         * - HP puede escalar con tu progreso (días jugados, oro acumulado, etc.)
         * 
         * EJEMPLO:
         * - Ladrón básico: 10 HP
         * - Ladrón veterano: 20 HP
         * - Bandido: 30 HP
         * - Jefe: 100 HP
         */
        hp: 10,

        /**
         * damage: Daño que hace el enemigo por turno
         * - 5 = Daño base del ladrón
         * 
         * MECÁNICA:
         * - Cada turno del enemigo te quita este daño en oro o stamina
         * - Puede tener efectos especiales según tipo de enemigo
         * 
         * POSIBLES EFECTOS (a implementar):
         * - Ladrón: Te roba oro directamente
         * - Lobo: Te quita stamina
         * - Bandido: Te daña el pico (reduce durabilidad)
         * 
         * ESCALADO:
         * - Enemigos más fuertes hacen más daño
         * - damage puede ser aleatorio (5-10 por ejemplo)
         */
        damage: 5
    }

    // ===== PROPIEDADES FUTURAS A AÑADIR =====
    // 
    // playerStats: {
    //     hp: 100,              // Tu vida en combate
    //     attackPower: 10,      // Tu daño por ataque
    //     defense: 5,           // Reducción de daño recibido
    //     critChance: 0.1       // 10% probabilidad de crítico
    // },
    // 
    // turnCount: 0,             // Número de turnos transcurridos
    // playerTurn: true,         // true = tu turno, false = turno del enemigo
    // 
    // rewards: {                // Recompensas al ganar
    //     gold: 500,
    //     items: ["health_potion"],
    //     exp: 50
    // },
    // 
    // combatLog: [],            // Registro de acciones del combate
    //                           // ["Golpeaste por 10 daño", "El ladrón te atacó por 5 daño"]
};

export default InitialCombatState;