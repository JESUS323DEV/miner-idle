/**
 * Estado inicial de los snacks de oro.
 * 
 * SISTEMA:
 * - Se compran/mejoran con monedas de taberna
 * - Dan buffs temporales de oro
 * - Cada snack tiene efectos únicos por nivel
 */

const InitialSnacksState = {
    cookie: {
        unlocked: false,  // Requiere 5 monedas para desbloquear
        level: 0,         // 0 = bloqueado, 1-3 = niveles
        active: null      // null o { startTime, duration, effect, bonusApplied }
    },
    drink: {
        unlocked: false,
        level: 0,
        active: null
    },
    cake: {
        unlocked: false,
        level: 0,
        active: null
    }
};

export default InitialSnacksState;