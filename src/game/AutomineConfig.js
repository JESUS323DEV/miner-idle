/**
 * Configuración del sistema de automine.
 * 
 * Centraliza valores para fácil ajuste y balanceo.
 */

export const AutomineConfig = {
    // ===== DESBLOQUEO =====
    unlockCost: 1500,        // Oro necesario para desbloquear

    // ===== CARGAS =====
    maxCharges: 2,           // Máximo de cargas disponibles
    chargeRecoveryTime: 30,  // Segundos para recuperar 1 carga (60s = 1 min)

    // ===== VELOCIDAD =====
    clickInterval: 140       // Milisegundos entre clicks (100ms = 10 clicks/seg)
                             // Valores: 50ms = 20/seg, 100ms = 10/seg, 200ms = 5/seg
};