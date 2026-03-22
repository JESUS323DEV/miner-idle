// ========== HELPER: DETECTA HITOS Y MARCA hasUnclaimed ==========
export const checkMilestone = (milestoneConfig, currentValue) => {
    const { claimed, firstStep, step } = milestoneConfig;
    const nextTarget = claimed.length === 0
        ? firstStep
        : firstStep + step * claimed.length;
    return currentValue >= nextTarget;
};

// ========== HELPER: CALCULA RECOMPENSA DEL SIGUIENTE HITO ==========
export const getMilestoneReward = (milestoneConfig) => {
    const { claimed, tiers, rewardBase, rewardIncrease } = milestoneConfig;
    const index = claimed.length;

    if (tiers) {
        const tier = tiers.find(t => index < t.upTo);
        if (!tier) return tiers[tiers.length - 1].max;
        const prevUpTo = tiers[tiers.indexOf(tier) - 1]?.upTo || 0;
        const posInTier = index - prevUpTo;
        return Math.min(tier.base + posInTier * tier.increase, tier.max);
    }

    return rewardBase + (index * rewardIncrease);
};
