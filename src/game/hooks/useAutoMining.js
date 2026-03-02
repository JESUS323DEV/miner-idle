import { useEffect, useRef } from 'react';

/**
 * HOOK: useAutoMining
 * 
 * Gestiona el sistema de minado automático del juego.
 * 
 * FUNCIONAMIENTO:
 * - Cuando isMining === true, ejecuta handleMine() cada 500ms
 * - Auto-detención: Si stamina o durabilidad llegan a 0, desactiva isMining
 * - Usa useRef para mantener la referencia del interval entre renders
 * 
 * @param {Object} gameState - Estado completo del juego
 * @param {Function} handleMine - Función que ejecuta una picada (resta stamina/durabilidad, suma oro)
 * @param {Function} setGameState - Setter del estado del juego (para detener auto-minar)
 */
export const useAutoMining = (gameState, handleMine, setGameState) => {
    // Guarda la referencia del interval para poder limpiarlo después
    const intervalRef = useRef(null);

    useEffect(() => {
        // ===== AUTO-DETENCIÓN: Si no hay recursos, detiene el minado automático =====
        if (gameState.stamina <= 0 || gameState.pickaxe.durability <= 0) {
            // Si el auto-minar está activo, lo desactiva
            if (gameState.isMining) {
                setGameState(prevState => ({
                    ...prevState,
                    isMining: false  // Cambia el estado a "no minando"
                }));
            }
            return;  // Sale del effect sin crear el interval
        }

        // ===== MINADO ACTIVO: Ejecuta handleMine cada 500ms =====
        if (gameState.isMining) {
            // Crea un interval que ejecuta handleMine cada 500ms
            intervalRef.current = setInterval(() => {
                handleMine();  // Ejecuta una picada (resta stamina, suma oro, etc.)
            }, 500);  // Velocidad del auto-minar (ajustable: 500ms = 2 picadas/segundo)
        } else {
            // Si isMining es false, limpia el interval si existe
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        // ===== CLEANUP: Limpia el interval cuando el componente se desmonta o cambia isMining =====
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [gameState.isMining, handleMine]);  // Se ejecuta cuando cambia isMining o handleMine
};

export default useAutoMining;