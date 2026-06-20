/**
 * Configuración del sistema de automine.
 *
 * Centraliza valores para fácil ajuste y balanceo.
 */

export const AutomineConfig = {
    // ===== DESBLOQUEO =====
    unlockCost: 2000,

    // ===== CARGAS =====
    maxCharges: 2,
    chargeRecoveryTime: 30,  // segundos base

    // ===== MEJORAS DE RECARGA (5 niveles) =====
    chargeUpgrades: [
        { level: 1, cost: 5000,     reductionSeconds: 4 },
        { level: 2, cost: 25000,    reductionSeconds: 4 },
        { level: 3, cost: 100000,   reductionSeconds: 5 },
        { level: 4, cost: 500000,   reductionSeconds: 5 },
        { level: 5, cost: 2000000,  reductionSeconds: 5 },
    ],
    // 30s → 26s → 22s → 17s → 12s → 7s al máximo nivel

    // ===== PODER =====
    poderCooldown: 120,      // segundos de cooldown entre usos

    // ===== VELOCIDAD =====
    clickInterval: 140,
};
