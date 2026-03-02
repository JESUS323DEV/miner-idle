/**
 * ARCHIVO: NightEvents.js
 * 
 * Contiene todos los eventos que pueden ocurrir durante la noche.
 * 
 * ESTRUCTURA DE UN EVENTO:
 * - id: Identificador único del evento
 * - name: Nombre del evento (se muestra como título)
 * - description: Texto descriptivo de lo que está pasando
 * - options: Función que devuelve array de opciones según el estado del juego
 * 
 * CÓMO FUNCIONAN LAS OPTIONS:
 * - Reciben gameState actual
 * - Devuelven array de objetos con {id, label, resolve}
 * - resolve() modifica el gameState y devuelve el nuevo estado
 * 
 * Las opciones pueden cambiar dinámicamente según:
 * - Stamina disponible
 * - Oro acumulado
 * - Items en inventario
 * - Flags de eventos previos
 */

export const NightEvents = [
    {
        id: "thief_night",
        name: "Un ladrón en la noche",
        description:
            "Reconoces al tipo de la taberna. Te observa desde la oscuridad con intención de robarte.",

        /**
         * OPTIONS: Opciones del evento del ladrón
         * 
         * Si tienes stamina > 0:
         *   - Opción 1: Luchar (inicia combate)
         *   - Opción 2: Dejarlo ir (pierdes 200-700 oro)
         * 
         * Si stamina === 0:
         *   - Opción única: Te roba automáticamente (pierdes 300-1100 oro)
         */
        options: (gameState) => {
            // CASO 1: Tienes stamina para defenderte
            if (gameState.stamina > 0) {
                return [
                    {
                        id: "fight",
                        label: "Enfrentarte al ladrón",
                        // Activa el sistema de combate
                        resolve: (gameState) => ({
                            ...gameState,
                            isInCombat: true,        // Cambia a pantalla de combate
                            combatResolved: false    // Marca que el combate no ha terminado
                        })
                    },
                    {
                        id: "let_him_go",
                        label: "No arriesgarse",
                        // Pierdes oro pero evitas el combate
                        resolve: (gameState) => {
                            const stolenGold = Math.floor(Math.random() * 500) + 200; // 200-700 oro
                            return {
                                ...gameState,
                                gold: Math.max(0, gameState.gold - stolenGold), // Nunca oro negativo
                                nightResolved: true // Marca el evento como resuelto
                            };
                        }
                    }
                ];
            }

            // CASO 2: Sin stamina, no puedes defenderte
            return [
                {
                    id: "robbed",
                    label: "No puedes hacer nada",
                    // Te roban más oro porque estás indefenso
                    resolve: (gameState) => {
                        const stolenGold = Math.floor(Math.random() * 800) + 300; // 300-1100 oro
                        return {
                            ...gameState,
                            gold: Math.max(0, gameState.gold - stolenGold), // Nunca oro negativo
                            nightResolved: true // Marca el evento como resuelto
                        };
                    }
                }
            ];
        }
    }

    // ===== AÑADIR MÁS EVENTOS AQUÍ =====
    // 
    // Ejemplo de nuevo evento:
    // {
    //     id: "wolf_attack",
    //     name: "Ataque de lobos",
    //     description: "Una manada de lobos rodea tu campamento...",
    //     options: (gameState) => {
    //         // ... tus opciones aquí
    //     }
    // },
];