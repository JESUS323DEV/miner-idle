/**
 * ARCHIVO: InitialLadyState.js
 * 
 * Estado inicial de Lady (la mascota del juego).
 * 
 * SISTEMA DE LADY:
 * Lady es tu compañera que necesita cuidados. Su estado afecta al juego:
 * - Si está bien alimentada y feliz → Buffs activos
 * - Si tiene hambre o está triste → Penalizaciones
 * 
 * MECÁNICAS:
 * - Hunger baja con el tiempo (necesita comida)
 * - Mood sube/baja según interacciones (juguetes, comida, eventos)
 * - Buffs temporales se activan con snacks especiales
 */

const InitialLadyState = {
    // ===== NECESIDADES BÁSICAS =====

    /**
     * hunger: Nivel de hambre (0-100)
     * - 100 = Completamente alimentada
     * - 0 = Muerta de hambre
     * 
     * EFECTOS:
     * - < 50% → Penalización: solo +1 oro/seg (ignora upgrades)
     * - < 20% → Penalización severa (a implementar)
     * 
     * MECÁNICA:
     * - Baja automáticamente con el tiempo
     * - Se recarga dando comida
     * - Snacks especiales pueden congelar temporalmente la bajada
     */
    hunger: 100,

    /**
     * mood: Estado de ánimo (0-100)
     * - 100 = Muy feliz
     * - 0 = Muy triste
     * 
     * EFECTOS:
     * - > 80% → Buff activo (a implementar)
     * - < 30% → Penalización (a implementar)
     * 
     * MECÁNICA:
     * - Sube al jugar con juguetes
     * - Baja si no interactúas con Lady
     * - Baja si tiene mucha hambre
     */
    mood: 100,

    // ===== BUFFS TEMPORALES =====

    /**
     * moodBuffActive: Si el buff de mood está activo
     * - true = Buff activo (bonificación aplicándose)
     * - false = Sin buff
     * 
     * ACTIVACIÓN:
     * - Se activa al darle snacks de "Calm" (calma/felicidad)
     * - Dura hasta que moodBuffUntil llegue a la hora actual
     * 
     * EFECTO (a implementar):
     * - Ejemplo: +20% oro por segundo
     * - Ejemplo: Regeneración de stamina más rápida
     */
    moodBuffActive: false,

    /**
     * moodBuffUntil: Timestamp de cuándo expira el buff de mood
     * - null = Sin buff activo
     * - Number (timestamp) = Expira en esa fecha/hora
     * 
     * EJEMPLO:
     * - Si comes snack a las 14:00 con duración de 5 min
     * - moodBuffUntil = timestamp de 14:05
     * - A las 14:05 se desactiva automáticamente
     */
    moodBuffUntil: null,

    /**
     * hungerFreezeUntil: Timestamp de cuándo expira el congelamiento de hambre
     * - null = Hambre baja normalmente
     * - Number (timestamp) = Hambre congelada hasta esa fecha/hora
     * 
     * ACTIVACIÓN:
     * - Se activa con snacks especiales que "congelan" el hambre
     * - Útil para sesiones largas de minado sin interrupciones
     * 
     * EFECTO:
     * - Mientras esté activo, hunger no baja con el tiempo
     * - Permite ignorar la mecánica de alimentación temporalmente
     */
    hungerFreezeUntil: null,

    /**
     * goldBuffUntil: Timestamp de cuándo expira el buff de oro
     * - null = Sin buff de oro activo
     * - Number (timestamp) = Buff activo hasta esa fecha/hora
     * 
     * ACTIVACIÓN:
     * - Se activa con snacks de "Productivity" (productividad)
     * - Ideal para farmear oro rápidamente
     * 
     * EFECTO (a implementar):
     * - Ejemplo: x2 oro por segundo
     * - Ejemplo: x2 oro por click en la mena
     * - Ejemplo: Reduce consumo de stamina al minar
     */
    goldBuffUntil: null
};

export default InitialLadyState;