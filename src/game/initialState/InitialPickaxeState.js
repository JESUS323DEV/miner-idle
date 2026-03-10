/**
 * ARCHIVO: InitialPickaxeState.js
 * 
 * Estado del pico (herramienta principal de minado).
 * 
 * SISTEMA DE PICO:
 * El pico es esencial para minar y tiene 2 ejes de mejora:
 * - TIER (0→1→2→3): Mejora durabilidad, no afecta oro/mina
 * - MATERIAL (stone→bronze→metal→diamond): Mejora oro/mina, resetea tier a 0
 * 
 * PROGRESIÓN:
 * 1. Empiezas con pico de piedra tier 0
 * 2. Subes tier 3 veces (mejora durabilidad cada vez)
 * 3. Al tier 3, puedes cambiar a bronce (requiere bronce + oro)
 * 4. El pico vuelve a tier 0 pero da más oro/mina
 * 5. Repites proceso con cada material
 * 
 * MECÁNICA DE DURABILIDAD:
 * - Cada picada consume 1 durabilidad
 * - Al llegar a 0 → No puedes minar
 * - Debes reparar pagando oro
 * - El coste de reparación sube al mejorar tier/material
 * 
 * MATERIALES Y ORO/MINA:
 * - Stone: 5 oro/mina
 * - Bronze: 8 oro/mina
 * - Metal: 12 oro/mina
 * - Diamond: 20 oro/mina
 */

// ===== TIPO Y NIVEL DEL PICO =====

/**
 * material: Material actual del pico
 * - "stone" = Piedra (inicial)
 * - "bronze" = Bronce (requiere 50 bronce + oro)
 * - "metal" = Metal/Hierro (requiere 30 hierro + oro)
 * - "diamond" = Diamante (requiere 10 diamante + oro)
 * 
 * EFECTO:
 * - Determina goldPerMine (cuánto oro da cada picada)
 * - Determina sprite/imagen del pico en UI
 * - Afecta coste de reparación (materiales mejores = más caro)
 * 
 * UPGRADE:
 * - Solo puedes cambiar material cuando tier === 3
 * - Al cambiar material → tier vuelve a 0
 * - Debes volver a subir tier para siguiente material
 */

/**
 * tier: Nivel de mejora del pico actual (0-3)
 * - 0 = Sin mejoras de tier
 * - 1 = +5 durabilidad máxima
 * - 2 = +10 durabilidad máxima total
 * - 3 = +15 durabilidad máxima total (máximo, desbloquea cambio de material)
 * 
 * MECÁNICA:
 * - Cada tier suma +5 maxDurability
 * - Cada tier suma +5 durability actual (bonus al mejorar)
 * - Al llegar a tier 3 → Botón cambia a "Upgrade Material"
 * - Al cambiar material → tier resetea a 0
 * 
 * COSTE:
 * - Solo oro (no requiere materiales)
 * - tierUpgradeCost (1000 oro inicial)
 */

// ===== DURABILIDAD =====

/**
 * durability: Durabilidad actual del pico
 * - 15 = Pico nuevo
 * - Baja 1 con cada picada (manual o auto)
 * - Al llegar a 0 → No puedes minar
 * 
 * RECUPERACIÓN:
 * - Reparar (pagar repairCost) → Restaura a maxDurability
 * - Upgrade de tier → Suma +5 durability (bonus)
 */

/**
    * maxDurability: Durabilidad máxima del pico
    * - 15 = Inicial (tier 0)
    * - +5 por cada tier (tier 1 = 20, tier 2 = 25, tier 3 = 30)
    * - Se mantiene al cambiar de material
    * 
    * PROGRESIÓN:
    * Stone tier 0: 15 max
    * Stone tier 3: 30 max
    * Bronze tier 0: 30 max (mantiene lo ganado)
    * Bronze tier 3: 45 max
    * Metal tier 0: 45 max
    * etc.
    */

// ===== PRODUCCIÓN DE ORO =====

/**
 * goldPerMine: Oro ganado por cada picada
 * - 5 = Pico de piedra
 * - Aumenta al cambiar material:
 *   - Stone: 5 oro
 *   - Bronze: 8 oro
 *   - Metal: 12 oro
 *   - Diamond: 20 oro
 * 
 * NOTA:
 * - NO aumenta con tier (tier solo mejora durabilidad)
 * - Solo aumenta al cambiar material
 * - Este valor también se guarda en gameState.goldPerMine
 *   (duplicado para facilitar acceso, se sincroniza al cambiar material)
 */

// ===== SISTEMA DE REPARACIÓN =====

/**
 * repairCost: Coste actual de reparar el pico
 * - 30 oro inicial
 * - Sube con cada upgrade de tier (+5 oro)
 * - Sube con cada cambio de material (+20 oro)
 * - NO sube con cada reparación (coste fijo hasta que mejores)
 * 
 * PROGRESIÓN:
 * - Stone tier 0: 30 oro
 * - Stone tier 1: 35 oro
 * - Stone tier 2: 40 oro
 * - Stone tier 3: 45 oro
 * - Bronze tier 0: 65 oro (45 + 20 del cambio de material)
 * - Bronze tier 1: 70 oro
 * - etc.
 * 
 * MECÁNICA:
 * - Pagas repairCost → durability = maxDurability
 * - El coste NO aumenta por reparar, solo por mejorar
 */
/**
    * repairCostIncrease: Cuánto aumenta el coste de reparación
    * - +15 oro por tier upgrade (actualmente +5, este valor no se usa bien)
    * - +20 oro por material upgrade
    * 
    * NOTA: Este valor está definido pero no se usa correctamente
    * Los incrementos están hardcodeados en las funciones de upgrade:
    * - Tier: +5 oro (línea en handleUpgradePickaxeTier)
    * - Material: +20 oro (línea en handleUpgradePickaxeMaterial)
    * 
    * TODO: Unificar usando este valor o eliminar si no se usa
    */

/**
    * repairCount: Contador de veces que has reparado el pico
    * - 0 = Nunca reparado
    * - Tracking/estadísticas
    * 
    * NOTA: Ya no afecta al coste (sistema cambiado)
    * Ahora el coste solo sube al mejorar tier/material, no al reparar
    * 
    * POSIBLES USOS:
    * - Achievements ("Repara el pico 100 veces")
    * - Stats en UI ("Has reparado X veces")
    * - Eventos ("Has reparado tanto que el herrero te ofrece descuento")
    */

// ===== COSTES DE MEJORAS =====

/**
 * tierUpgradeCost: Coste en oro para subir tier
 * - 1000 oro para subir de tier 0 a 1
 * - NO escala (siempre cuesta lo mismo subir tier)
 * 
 * MECÁNICA:
 * - Solo requiere oro (no requiere materiales)
 * - Disponible si tier < 3
 * - Al llegar a tier 3 → Botón cambia a "Upgrade Material"
 * 
 * NOTA TEMPORAL: 1000 oro para testing (puede ser muy alto/bajo)
 * Ajustar según balance del juego
 */

/**
 * materialUpgradeCost: Coste en oro para cambiar material
 * - 1000 oro base
 * - NO escala (siempre cuesta lo mismo cambiar material)
 * 
 * REQUISITOS:
 * - tier === 3
 * - Oro suficiente (materialUpgradeCost)
 * - Material suficiente:
 *   - Stone → Bronze: 50 bronce
 *   - Bronze → Metal: 30 hierro
 *   - Metal → Diamond: 10 diamante
 * 
 * MECÁNICA:
 * - Pagas oro + material
 * - Cambia material del pico
 * - Aumenta goldPerMine
 * - Resetea tier a 0
 * - Mantiene durabilidad actual y máxima
 * - Incrementa repairCost en +20 oro
 * 
 * NOTA TEMPORAL: 1000 oro para testing
 * Ajustar según balance (debe ser significativo pero alcanzable)
 */


const InitialPickaxeState = {

    material: "stone",
    tier: 0,
    durability: 15,           // Durabilidad actual del pico
    maxDurability: 15,        // Durabilidad máxima
    goldPerMine: 8,           // Oro por click en mina de oro
    repairCost: 30,           // Coste actual de reparar
    repairCostIncrease: 15,   // Cuánto sube el coste de reparar cada vez
    repairCount: 0,           // Veces que has reparado

    // Coste actual de subir tier
    tierUpgradeCosts: {
        stone: 1500,
        bronze: 2500,
        metal: 4000,
        diamond: 6000,
    },
    //=========================
    materialUpgradeCosts: {
        stone: { gold: 5000, ingot: { type: "bronzeIngot", amount: 100 } },
        bronze: { gold: 20000, ingot: { type: "ironIngot", amount: 150 } },
        metal: { gold: 30000, ingot: { type: "diamondIngot", amount: 200 } },
    },

    //======================
    miningPower: 1,              // Daño por click a las venas (base)
    miningPowerPerTier: 0.5,     // Cuánto sube miningPower por tier
    goldBonusPerTier: 0.1,       // % bonus de oro por tier (0.1 = 10%)
    materialBonusPerTier: 0.1,   // % bonus de materiales en minas por tier (0.1 = 10%)


    //======================
    tierIngotCosts: {
        stone: {
            0: { type: "bronzeIngot", amount: 10 },
            1: { type: "bronzeIngot", amount: 20 },
            2: { type: "bronzeIngot", amount: 30 },

            3: { type: "bronzeIngot", amount: 50 },
            4: { type: "bronzeIngot", amount: 60 },
        },
        bronze: {
            0: { type: "ironIngot", amount: 20 },
            1: { type: "ironIngot", amount: 30 },
            2: { type: "ironIngot", amount: 50 },

            3: { type: "ironIngot", amount: 70 },
            4: { type: "ironIngot", amount: 100 },
        },
        metal: {
            0: { type: "diamondIngot", amount: 30 },
            1: { type: "diamondIngot", amount: 40 },
            2: { type: "diamondIngot", amount: 60 },

            3: { type: "diamondIngot", amount: 90 },
            4: { type: "diamondIngot", amount: 150 },
        },
        diamond: {
            0: { type: "bronzeIngot", amount: 10 },
            1: { type: "ironIngot", amount: 20 },

            2: { type: "diamondIngot", amount: 30 },
            3: { type: "diamondIngot", amount: 30 },
            4: { type: "diamondIngot", amount: 30 },
        },
    },
};

export default InitialPickaxeState;