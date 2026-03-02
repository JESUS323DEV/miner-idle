import { useEffect } from 'react';

/**
 * Hook que gestiona expiración de buffs de snacks
 */
const useSnackBuffs = (gameState, setGameState) => {
    useEffect(() => {
        const interval = setInterval(() => {
            setGameState(prevState => {
                const now = Date.now();
                let updated = false;
                const newSnacks = { ...prevState.snacks };

                // Verifica cada snack
                Object.keys(newSnacks).forEach(snackType => {
                    const snack = newSnacks[snackType];

                    if (snack.active !== null) {
                        const elapsed = (now - snack.active.startTime) / 1000;

                        // Si expiró
                        if (elapsed >= snack.active.duration) {
                            newSnacks[snackType] = {
                                ...snack,
                                active: null  // Desactiva buff
                            };
                            updated = true;
                        }
                    }
                });

                if (updated) {
                    return {
                        ...prevState,
                        snacks: newSnacks
                    };
                }

                return prevState;
            });
        }, 1000);  // Verifica cada segundo

        return () => clearInterval(interval);
    }, [setGameState]);
};

export default useSnackBuffs;