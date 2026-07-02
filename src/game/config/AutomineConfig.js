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
    chargeRecoveryTime: 25,  // segundos base

    // ===== MEJORAS DE RECARGA (4 niveles) =====
    chargeUpgrades: [
        { level: 1, cost: 5000,     reductionSeconds: 5 },
        { level: 2, cost: 25000,    reductionSeconds: 5 },
        { level: 3, cost: 100000,   reductionSeconds: 5 },
        { level: 4, cost: 500000,   reductionSeconds: 3 },
    ],
    // 25s → 20s → 15s → 10s → 7s al máximo nivel

    // ===== PODER =====
    poderCooldown: 120,      // segundos de cooldown entre usos

    // ===== VELOCIDAD =====
    clickInterval: 140,
};
