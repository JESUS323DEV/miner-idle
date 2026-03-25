import { DogsConfig } from '../config/DogsConfig';
import { ForgeDogsConfig } from '../config/ForgeDogsConfig';

/**
 * Devuelve los stats reales de un perro aplicando el bonus de estrellas.
 * stars: 0 = sin estrella (base), 1-5 = estrellas mejoradas
 */
export const getDogStats = (dogId, stars = 0, isForge = false) => {
    const config = isForge ? ForgeDogsConfig[dogId] : DogsConfig[dogId];
    if (!config) return null;

    if (stars === 0) return config;

    const mult = 1 + config.starBonus * stars;

    if (isForge) {
        return {
            ...config,
            forgeBonus: {
                timeReduction: +(config.forgeBonus.timeReduction * mult).toFixed(2),
                doubleIngot:   +(config.forgeBonus.doubleIngot   * mult).toFixed(3),
                biomeBonus: {
                    bronze:  +(config.forgeBonus.biomeBonus.bronze  * mult).toFixed(1),
                    iron:    +(config.forgeBonus.biomeBonus.iron    * mult).toFixed(1),
                    diamond: +(config.forgeBonus.biomeBonus.diamond * mult).toFixed(1),
                },
            },
        };
    }

    const bonus = config.goldMineBonus;
    const scaledBonus = bonus.type === 'extraGold'
        ? { ...bonus, value: +(bonus.value * mult).toFixed(1) }
        : { ...bonus, chance: Math.min(1, +(bonus.chance * mult).toFixed(3)) };

    return {
        ...config,
        miningPower: +(config.miningPower * mult).toFixed(1),
        miningSpeed: +(config.miningSpeed / mult).toFixed(3), // más rápido = intervalo menor
        goldMineBonus: scaledBonus,
    };
};
