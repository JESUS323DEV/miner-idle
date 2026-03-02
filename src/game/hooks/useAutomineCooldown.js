import { useEffect } from 'react';

const useAutomineCooldown = (gameState, setGameState) => {
    useEffect(() => {
        const interval = setInterval(() => {
            setGameState(prevState => {
                if (!prevState.automine?.unlocked) return prevState;

                const now = Date.now();
                let updated = false;
                const newCharges = prevState.automine.charges.map(charge => {
                    if (!charge.available && charge.cooldownUntil && now >= charge.cooldownUntil) {
                        updated = true;
                        return { available: true, cooldownUntil: null };
                    }
                    return charge;
                });

                if (updated) {
                    return {
                        ...prevState,
                        automine: {
                            ...prevState.automine,
                            charges: newCharges
                        }
                    };
                }

                return prevState;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [setGameState]);
};

export default useAutomineCooldown;