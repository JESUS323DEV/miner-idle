/**
 * Configuración del sistema de combos.
 * 
 * Centraliza todos los valores para facilitar balanceo.
 */

export const CombosConfig = {
    // ===== BONUS DE ORO =====
    bonusMultiplier: 10,      // Multiplicador base (combo 20 = 20 * 10 = 100 oro)
    bonusRepeated: 0.3,      // % cuando repites hito 30% 

    // ===== HITOS =====
    firstMilestone: 20,      // Primer combo que da bonus
    milestoneInterval: 5,    // Cada cuántos combos (20, 25, 30, 35...)

    // ===== TIMING =====
    resetTime: 1000          // Tiempo en ms antes de reset (1000ms = 1 segundo)
};