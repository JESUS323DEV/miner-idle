import { useEffect } from 'react';

/**
 * HOOK: useGoldPerSecond
 * 
 * Gestiona la producción pasiva de oro (oro automático cada segundo).
 * 
 * FUNCIONAMIENTO:
 * - Ejecuta un interval cada 1000ms (1 segundo)
 * - Suma oro según goldPerSecond (modificado por reglas/buffs)
 * - Aplica penalizaciones (ej: Lady con hambre)
 * - Aplica buffs temporales (ej: snacks, powerups)
 * 
 * REGLAS ACTUALES:
 * - Si Lady.hunger < 50% → solo +1 oro/seg (penalización)
 * - Si Lady está bien alimentada → goldPerSecond completo
 * 
 * @param {Object} gameState - Estado completo del juego (no usado directamente, solo para referencia)
 * @param {Function} setGameState - Setter del estado del juego
 */
export const useGoldPerSecond = (gameState, setGameState) => {

    // Estado inicial (actualmente no se usa, puede eliminarse o usarse para reset)
    const initialState = {
        gold: 0,
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setGameState(prevState => {
                let goldToAdd = prevState.goldPerSecond;

                // ✅ APLICA BUFF DE SNACKS
                const activeSnack = Object.values(prevState.snacks).find(s => s.active !== null);

                if (activeSnack && activeSnack.active) {
                    const now = Date.now();
                    const elapsed = (now - activeSnack.active.startTime) / 1000;  // En segundos

                    // Si el buff sigue activo
                    if (elapsed < activeSnack.active.duration) {
                        goldToAdd += activeSnack.active.effect;  // Suma el bonus
                    }
                }

                return {
                    ...prevState,
                    gold: prevState.gold + goldToAdd
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [setGameState]);
};

export default useGoldPerSecond;