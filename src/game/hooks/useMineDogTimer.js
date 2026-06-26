import { useEffect } from 'react';

export const useMineDogTimer = (setGameState) => {
    useEffect(() => {
        const t = setInterval(() => {
            setGameState(prev => {
                const dogs = prev.dogs;
                const updates = {};

                Object.entries(dogs).forEach(([key, dog]) => {
                    if (!dog || typeof dog !== 'object' || Array.isArray(dog)) return;
                    const timer = dog.mineCompTimer;
                    if (!timer || timer.activeFrom === null || timer.remaining <= 0) return;

                    const newRemaining = timer.remaining - 1;
                    updates[key] = {
                        ...dog,
                        assignedTo: newRemaining <= 0 ? null : dog.assignedTo,
                        mineCompTimer: {
                            remaining: newRemaining,
                            activeFrom: newRemaining > 0 ? timer.activeFrom : null,
                        },
                    };
                });

                if (Object.keys(updates).length === 0) return prev;
                return { ...prev, dogs: { ...dogs, ...updates } };
            });
        }, 1000);
        return () => clearInterval(t);
    }, []);
};
