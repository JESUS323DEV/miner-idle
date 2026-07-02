import { useEffect, useRef } from 'react';
import { ForgeDogsConfig } from '../config/ForgeDogsConfig.js';

export const useGoldTrickle = (globalSlots, setGameState) => {
    const trickleRef = useRef([
        { cooldown: 60, active: false, activeRemaining: 0 },
        { cooldown: 60, active: false, activeRemaining: 0 },
        { cooldown: 60, active: false, activeRemaining: 0 },
    ]);
    const globalSlotsRef = useRef(globalSlots);

    useEffect(() => {
        globalSlotsRef.current = globalSlots;
    }, [globalSlots]);

    useEffect(() => {
        const t = setInterval(() => {
            const slots = globalSlotsRef.current;
            const trickle = trickleRef.current;
            let goldGained = 0;
            const newTrickle = trickle.map((timer, i) => {
                const dogId = slots[i];
                const bonus = dogId ? ForgeDogsConfig[dogId]?.globalSlotBonus : null;
                if (!bonus || bonus.type !== 'goldTrickle') return { cooldown: 60, active: false, activeRemaining: 0 };
                if (timer.active) {
                    goldGained += Math.floor(Math.random() * (bonus.max - bonus.min + 1)) + bonus.min;
                    const rem = timer.activeRemaining - 1;
                    return rem <= 0 ? { cooldown: 60, active: false, activeRemaining: 0 } : { ...timer, activeRemaining: rem };
                }
                const cd = timer.cooldown - 1;
                return cd <= 0 ? { active: true, activeRemaining: 10, cooldown: 0 } : { ...timer, cooldown: cd };
            });
            trickleRef.current = newTrickle;
            if (goldGained > 0) {
                setGameState(prev => ({
                    ...prev,
                    gold: prev.gold + goldGained,
                }));
            }
        }, 1000);
        return () => clearInterval(t);
    }, []); // eslint-disable-line
};
