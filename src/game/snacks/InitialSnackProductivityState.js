/**
 * ARCHIVO: InitialSnackProductivityState.js
 * 
 * Estado inicial del Snack de Productividad (Productivity Snack).
 * 
 * SISTEMA DE SNACKS:
 * Los snacks son consumibles que dan buffs temporales a Lady.
 * Existen 2 tipos principales:
 * - Calm Snack → Mejora mood/felicidad
 * - Productivity Snack (este archivo) → Mejora producción de oro
 * 
 * SNACK DE PRODUCTIVIDAD:
 * - Aumenta la generación de oro (pasivo y/o por click)
 * - Buff temporal de oro (bonificación especial)
 * - Útil para sesiones de farmeo intensivo
 * - MÁS CARO que Calm Snack (90 vs 50) porque da ventaja económica directa
 * 
 * MECÁNICA:
 * - Pagas oro para dar el snack
 * - Activa buff por X tiempo
 * - Ganas más oro mientras el buff esté activo
 * - El coste aumenta con cada uso
 */

const InitialSnackProductivityState = {
    // ===== PROGRESIÓN Y NIVEL =====

    /**
     * level: Nivel del snack (mejoras compradas)
     * - 0 = Sin mejoras (buff básico)
     * - 1+ = Mejorado (buff más potente o duradero)
     * 
     * POSIBLE PROGRESIÓN:
     * - Nivel 0: x2 oro por 5 minutos
     * - Nivel 1: x2 oro por 7 minutos
     * - Nivel 2: x2.5 oro por 10 minutos
     * - Nivel 3: x3 oro por 10 minutos + no consume stamina al minar
     * 
     * MEJORAS:
     * - Sistema de upgrade que mejora potencia o duración
     * - Puede reducir el coste de uso
     */
    level: 0,

    // ===== SISTEMA DE COSTE ESCALABLE =====

    /**
     * baseCost: Coste base del snack (primera vez)
     * - 90 oro (casi el doble que Calm Snack)
     * 
     * DISEÑO:
     * - Más caro porque genera retorno de inversión directo
     * - Calm da mood (beneficio indirecto)
     * - Productivity da oro (beneficio directo → más caro)
     */
    baseCost: 90,

    /**
     * currentCost: Coste actual del snack
     * - Comienza en 90 oro
     * - Aumenta +5 oro cada vez que lo usas
     * 
     * PROGRESIÓN:
     * - Uso 1: 90 oro
     * - Uso 2: 95 oro
     * - Uso 3: 100 oro
     * - Uso 10: 135 oro
     * - etc.
     * 
     * BALANCE:
     * - Si el buff da x2 oro y dura 5 minutos
     * - Ganas ~600 oro extra (goldPerSecond x 2 x 300 segundos)
     * - Pagas 90 oro → Ganancia neta ~510 oro
     * - Rentable pero no OP
     */
    currentCost: 90,

    /**
     * useCostIncrease: Cuánto sube el coste con cada uso
     * - +5 oro por uso (igual que Calm)
     * 
     * FÓRMULA AL DAR SNACK:
     * 1. Pagas currentCost
     * 2. currentCost = currentCost + useCostIncrease
     * 3. totalUses = totalUses + 1
     * 4. Activa goldBuffUntil en Lady
     */
    useCostIncrease: 5,

    /**
     * totalUses: Contador total de veces que has usado este snack
     * - 0 = Nunca usado
     * - Tracking/estadísticas
     * 
     * POSIBLES USOS:
     * - Achievements ("Usa Productivity Snack 50 veces")
     * - Desbloqueos ("Al usar 25 veces, aumenta duración del buff")
     * - Stats ("Has generado X oro extra con este snack")
     */
    totalUses: 0,

    // ===== DESBLOQUEO Y ESTADO =====

    /**
     * locked: Si el snack está bloqueado
     * - false = Disponible desde el inicio
     * - true = Necesitas desbloquearlo
     * 
     * POSIBLE MECÁNICA DE DESBLOQUEO:
     * - Alcanzar goldPerSecond nivel 5
     * - Completar evento de taberna
     * - Pagar 1000 oro para desbloquear permanentemente
     */
    locked: false,

    // ===== BUFF TEMPORAL =====

    /**
     * buffUntil: Timestamp de cuándo expira el buff de productividad
     * - null = Sin buff activo
     * - Number (timestamp) = Buff activo hasta esa fecha/hora
     * 
     * MECÁNICA:
     * 1. Das el snack → buffUntil = Date.now() + duración
     * 2. Mientras Date.now() < buffUntil → Buff activo
     * 3. Cuando Date.now() >= buffUntil → Buff expira
     * 
     * SINCRONIZACIÓN CON LADY:
     * - Este buffUntil se copia a lady.goldBuffUntil
     * - Se usa para verificar si el buff está activo
     * 
     * EFECTOS DEL BUFF (a implementar):
     * 
     * EN useGoldPerSecond:
     * - if (Date.now() < lady.goldBuffUntil) {
     *     goldToAdd = goldToAdd * 2;  // x2 oro pasivo
     *   }
     * 
     * EN handleMineClick:
     * - if (Date.now() < lady.goldBuffUntil) {
     *     goldEarned = goldPerMine * 2;  // x2 oro por click
     *   }
     * 
     * OPCIONES ALTERNATIVAS:
     * - No consume stamina al minar
     * - Reduce consumo de durabilidad del pico
     * - Probabilidad de oro doble por click (RNG)
     */
    buffUntil: null
};

export default InitialSnackProductivityState;