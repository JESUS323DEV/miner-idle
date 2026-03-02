/**
 * ARCHIVO: InitialNightState.js
 * 
 * Estado del sistema de eventos nocturnos.
 * 
 * SISTEMA DE NOCHE:
 * - Cuando llega la noche (timeOfDay = "night"), pueden ocurrir eventos especiales
 * - El evento más común es el ladrón que intenta robarte
 * - Los eventos se resuelven antes de poder continuar
 * - Las decisiones que tomas afectan el estado del juego
 * 
 * FLOW DEL SISTEMA:
 * 1. Llega la noche → isNight = true
 * 2. Se selecciona un evento según probabilidades/condiciones
 * 3. nightEvent se asigna con el evento activo
 * 4. Jugador elige una opción → nightResolved = true
 * 5. Se aplican consecuencias (robo, combate, etc.)
 * 6. Vuelve al día → isNight = false, nightResolved = false
 * 
 * RELACIÓN CON OTROS SISTEMAS:
 * - thiefRisk (gameState) → Aumenta probabilidad de eventos
 * - hasTriggeredGoldThief (gameState) → Primera vez garantizada
 * - stamina → Determina qué opciones están disponibles
 * - combat → Se activa si eliges luchar
 */

const InitialNightState = {

    // ===== ESTADO DE LA NOCHE =====

    /**
     * isNight: Si actualmente es de noche
     * - false = Día (gameplay normal)
     * - true = Noche (evento nocturno activo)
     * 
     * ACTIVACIÓN:
     * - Se activa cuando timeOfDay cambia a "night"
     * - O cuando hour llega a 19-20 (dependiendo de tu sistema)
     * 
     * EFECTO:
     * - Bloquea ciertas acciones (ej: no puedes ir a la taberna)
     * - Activa selector de eventos nocturnos
     * - Puede mostrar overlay oscuro en UI
     * 
     * DESACTIVACIÓN:
     * - Cuando nightResolved = true y avanzas al siguiente día
     */
    isNight: false,

    /**
     * nightResolved: Si el evento nocturno ya fue resuelto
     * - false = Evento en progreso (debes elegir opción)
     * - true = Evento completado (puedes avanzar al día)
     * 
     * MECÁNICA:
     * - Mientras nightResolved = false → Pantalla bloqueada en evento
     * - Solo puedes avanzar cuando tomes una decisión
     * - Se resetea a false al inicio de cada noche
     * 
     * EJEMPLO:
     * 1. Llega la noche → nightResolved = false
     * 2. Aparece ladrón → Esperando decisión
     * 3. Eliges "Luchar" → nightResolved = true
     * 4. Pasas al combate → Después vuelves al día
     */
    nightResolved: false,

    /**
     * nightEvent: Evento nocturno actualmente activo
     * - null = Sin evento (noche normal)
     * - Object = Evento en progreso
     * 
     * ESTRUCTURA DEL EVENTO:
     * {
     *   id: "thief_night",
     *   name: "Un ladrón en la noche",
     *   description: "Reconoces al tipo de la taberna...",
     *   options: [
     *     { id: "fight", label: "Enfrentarte", resolve: fn() },
     *     { id: "let_him_go", label: "No arriesgarse", resolve: fn() }
     *   ]
     * }
     * 
     * SELECCIÓN DE EVENTO:
     * - Al llegar la noche, se ejecuta función selectNightEvent()
     * - Verifica condiciones (oro > X, thiefRisk, etc.)
     * - Selecciona evento de NightEvents.js
     * - Asigna a nightEvent
     * 
     * USO EN UI:
     * - if (nightEvent) → Muestra modal con evento
     * - Renderiza nightEvent.description
     * - Muestra botones con nightEvent.options
     */
    nightEvent: null,

    /**
     * nightQueue: Cola de eventos nocturnos pendientes
     * - [] = Sin eventos en cola
     * - [event1, event2] = Múltiples eventos esa noche
     * 
     * PROPÓSITO:
     * - Permite que ocurran múltiples eventos en una sola noche
     * - Se resuelven en secuencia
     * 
     * MECÁNICA:
     * 1. Al llegar la noche → nightQueue se llena con eventos
     * 2. Se toma el primer evento → nightEvent = nightQueue[0]
     * 3. Resuelves evento → nightQueue.shift() (quita el primero)
     * 4. Si nightQueue.length > 0 → nightEvent = nightQueue[0]
     * 5. Si nightQueue.length === 0 → nightResolved = true
     * 
     * EJEMPLO:
     * - Noche especial con 2 eventos:
     *   nightQueue = [evento_lobo, evento_ladron]
     * - Resuelves lobo → nightQueue = [evento_ladron]
     * - Resuelves ladrón → nightQueue = []
     * - nightResolved = true → Pasa al día
     * 
     * USO FUTURO:
     * - Eventos en cadena ("Resolviste el robo, pero atrajo lobos")
     * - Noches especiales (Luna llena → más eventos)
     * - Penalizaciones acumuladas (muchos rechazos → múltiples ataques)
     */
    nightQueue: []

};

export default InitialNightState;