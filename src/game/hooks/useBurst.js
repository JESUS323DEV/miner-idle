import { useEffect } from 'react';

const getRechargeTime = (lvl) => {
    if (lvl <= 20) return Math.round(40 - lvl * 0.5);
    if (lvl <= 40) return Math.round(30 - (lvl - 20) * 0.25);
    if (lvl <= 55) return Math.round(25 - (lvl - 40) * (5 / 15));
    return 20;
};

export const useBurst = (setGameState) => {
    useEffect(() => {
        const t = setInterval(() => {
            setGameState(prev => {
                const burst = prev.burst ?? { active: false, recharging: false, rechargeRemaining: 0 };
                if (!burst.active && !burst.recharging) return prev;
                if (burst.active) {
                    const newStamina = prev.stamina - 1;
                    if (newStamina <= 0) {
                        return {
                            ...prev,
                            stamina: 0,
                            burst: { active: false, recharging: true, rechargeRemaining: getRechargeTime(prev.maxStaminaLevel ?? 0) }
                        };
                    }
                    return { ...prev, stamina: newStamina };
                }
                if (burst.recharging) {
                    const newRecharge = burst.rechargeRemaining - 1;
                    if (newRecharge <= 0) {
                        const drinkBuffRecharge = prev.snacks?.drink?.active?.type === 'stamina' ? (prev.snacks.drink.active.effect ?? 0) : 0;
                        return {
                            ...prev,
                            stamina: prev.maxStamina + drinkBuffRecharge,
                            burst: { active: false, recharging: false, rechargeRemaining: 0 }
                        };
                    }
                    return { ...prev, burst: { ...burst, rechargeRemaining: newRecharge } };
                }
                return prev;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [setGameState]);
};
