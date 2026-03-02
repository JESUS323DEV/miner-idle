/**
 * ARCHIVO: InitialLadyToysState.js
 * 
 * Estado inicial de los juguetes de Lady.
 * 
 * SISTEMA DE JUGUETES:
 * - Mejoran el mood (estado de ánimo) de Lady
 * - Se desbloquean con oro
 * - Coste de uso aumenta con cada interacción
 * - Mejores juguetes dan más mood pero cuestan más
 * 
 * PROGRESIÓN:
 * - Empiezas con 1 juguete (ball) desbloqueado
 * - Desbloqueas más juguetes comprándolos
 * - Cada juguete es más caro pero más efectivo
 * 
 * USO:
 * - Pagas oro para jugar con Lady
 * - Lady gana mood (felicidad)
 * - El coste aumenta gradualmente para balancear
 */

const InitialLadyToysState = {
    // ===== ESTADO GLOBAL DE JUGUETES =====

    /**
     * activeToy: Juguete actualmente seleccionado
     * - null = Ninguno seleccionado
     * - "ball", "toy2", etc. = Juguete activo
     * 
     * USO:
     * - Determina qué juguete se usa al clickear "Jugar"
     * - Puede servir para UI (mostrar juguete equipado)
     */
    activeToy: null,

    /**
     * unlockedToyIndex: Índice del último juguete desbloqueado
     * - 1 = Solo ball desbloqueado
     * - 2 = ball + toy2 desbloqueados
     * - etc.
     * 
     * USO:
     * - Tracking de progresión
     * - Puede usarse para mostrar "¡Nuevo juguete disponible!"
     */
    unlockedToyIndex: 1,

    // ===== JUGUETE 1: PELOTA (BÁSICO) =====

    ball: {
        /**
         * unlocked: Si el juguete está desbloqueado
         * - true desde el inicio (juguete básico gratuito)
         */
        unlocked: true,

        /**
         * unlockCost: Coste para desbloquear este juguete
         * - 0 porque viene desbloqueado desde el inicio
         */
        unlockCost: 0,

        /**
         * baseUseCost: Coste base de usar el juguete (primera vez)
         * - 50 oro para jugar con la pelota
         */
        baseUseCost: 50,

        /**
         * currentUseCost: Coste actual de usar el juguete
         * - Comienza igual al baseUseCost
         * - Aumenta cada vez que lo usas
         * 
         * EJEMPLO:
         * - Uso 1: 50 oro
         * - Uso 2: 55 oro
         * - Uso 3: 60 oro
         * - etc.
         */
        currentUseCost: 50,

        /**
         * useCostIncrease: Cuánto sube el coste con cada uso
         * - +5 oro cada vez que juegas con la pelota
         * 
         * FÓRMULA:
         * - Nuevo coste = currentUseCost + useCostIncrease
         */
        useCostIncrease: 5,

        /**
         * totalUses: Contador de veces que has usado este juguete
         * - Tracking/estadísticas
         * - Puede usarse para achievements
         */
        totalUses: 0,

        /**
         * moodBase: Cuánto mood da al usar este juguete
         * - +10 mood cada vez que juegas con la pelota
         * 
         * EFECTO:
         * - mood = Math.min(100, mood + moodBase)
         * - (nunca excede 100)
         */
        moodBase: 10
    },

    // ===== JUGUETE 2: [NOMBRE A DEFINIR] (INTERMEDIO) =====

    toy2: {
        /**
         * unlocked: Si el juguete está desbloqueado
         * - false desde el inicio (debes comprarlo)
         */
        unlocked: false,

        /**
         * unlockCost: Coste para desbloquear este juguete
         * - 500 oro (compra única)
         * 
         * MECÁNICA:
         * - Pagas 500 oro → unlocked = true
         * - Ahora puedes usarlo pagando currentUseCost
         */
        unlockCost: 500,

        /**
         * baseUseCost: Coste base de usar el juguete
         * - 100 oro (el doble que la pelota)
         */
        baseUseCost: 100,

        /**
         * currentUseCost: Coste actual de usar el juguete
         * - Comienza en 100 oro
         * - Sube +10 oro con cada uso
         */
        currentUseCost: 100,

        /**
         * useCostIncrease: Cuánto sube el coste con cada uso
         * - +10 oro cada vez (el doble que la pelota)
         */
        useCostIncrease: 10,

        /**
         * totalUses: Contador de usos de este juguete
         */
        totalUses: 0,

        /**
         * moodBase: Cuánto mood da al usar este juguete
         * - +20 mood (el doble que la pelota)
         * 
         * BALANCE:
         * - Cuesta el doble pero da el doble de mood
         * - Más eficiente a largo plazo si tienes oro
         */
        moodBase: 20
    }

    // ===== AÑADIR MÁS JUGUETES AQUÍ =====
    // 
    // Ejemplos de juguetes futuros:
    // 
    // toy3: {
    //     unlocked: false,
    //     unlockCost: 2000,
    //     baseUseCost: 200,
    //     currentUseCost: 200,
    //     useCostIncrease: 20,
    //     totalUses: 0,
    //     moodBase: 40  // x4 mood (súper juguete)
    // },
};

export default InitialLadyToysState;