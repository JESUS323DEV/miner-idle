/**
 * ARCHIVO: tavernEvents.js
 *
 * Contiene todos los eventos que pueden ocurrir en la taberna.
 *
 * DIFERENCIAS CON NIGHT EVENTS:
 * - Estos eventos solo ocurren durante el día (hora 9-20)
 * - Usan moneda de PLATA en vez de oro
 * - Pueden tener consecuencias que afecten a eventos nocturnos (thiefRisk)
 *
 * ESTRUCTURA DE UN EVENTO:
 * - id: Identificador único del evento
 * - name: Nombre del evento (título)
 * - description: Texto descriptivo de la situación
 * - canTrigger: Función que determina si el evento puede aparecer (según hora, recursos, etc.)
 * - options: Array de opciones disponibles
 *
 * ESTRUCTURA DE UNA OPCIÓN:
 * - id: Identificador de la opción
 * - label: Texto del botón
 * - resultText (opcional): Mensaje que aparece después de elegir
 * - resolve: Función que modifica el gameState según la elección
 */

export const tavernEvents = [
    {
        id: "shady_bet",
        name: "Apuesta dudosa",
        description: "Un tipo sospechoso te propone una apuesta rápida con plata.",

        /**
         * CAN TRIGGER: Verifica si el evento puede aparecer
         * Este evento solo aparece durante el horario de la taberna (9:00 - 20:00)
         */
        canTrigger: (gameState) => {
            return gameState.hour >= 9 && gameState.hour < 20;
        },

        options: [
            {
                id: "accept",
                label: "Aceptar la apuesta",
                /**
                 * RESOLVE: Lógica de la apuesta
                 * - 50% probabilidad de ganar
                 * - Ganas o pierdes 50 de plata
                 */
                resolve: (gameState) => {
                    // TODO: silver no implementado aún
                    // const win = Math.random() < 0.5;
                    // const amount = 50;
                    // if (win) return { ...gameState, silver: gameState.silver + amount };
                    // else return { ...gameState, silver: Math.max(0, gameState.silver - amount) };
                    return gameState;
                }
            },
            {
                id: "reject",
                label: "Rechazar",
                resultText: "¿Un cagón? Ya veremos si duermes tranquilo esta noche…",
                /**
                 * RESOLVE: Rechazar la apuesta
                 * CONSECUENCIA: Aumenta el riesgo de que aparezca el ladrón por la noche
                 * - thiefRisk acumula rechazos de NPCs
                 * - A mayor thiefRisk, mayor probabilidad de evento nocturno
                 */
                resolve: (gameState) => {
                    return {
                        ...gameState,
                        thiefRisk: gameState.thiefRisk + 1  // Incrementa riesgo de robo nocturno
                    };
                }
            }
        ]
    }

    // ===== AÑADIR MÁS EVENTOS DE TABERNA AQUÍ =====
    //
    // Ejemplos de eventos de taberna:
    // - Comprar información con plata
    // - Contratar mercenarios
    // - Intercambiar recursos (plata ↔ oro)
    // - Juegos de azar (dados, cartas)
    // - Rumores que desbloquean menas
    //
    // {
    //     id: "merchant_trade",
    //     name: "Comerciante viajero",
    //     description: "Un comerciante ofrece intercambiar plata por materiales...",
    //     canTrigger: (gameState) => gameState.silver >= 100,
    //     options: [...]
    // },
];
