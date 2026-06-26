
const TIMER_INIT = { remaining: 0, activeFrom: null };

export const InitialDogsState = {
    globalSlots: [null, null, null], // [dogId, dogId, null] — slots globales de pasivas

    chihuahua: { id: 'chihuahua', hired: false, assignedTo: null, stars: 0, fragments: 0, mineCompTimer: TIMER_INIT },
    lady:      { id: 'lady',      hired: false, assignedTo: null, stars: 0, fragments: 0, mineCompTimer: TIMER_INIT },
    tokio:     { id: 'tokio',     hired: false, assignedTo: null, stars: 0, fragments: 0, mineCompTimer: TIMER_INIT },
    tuka:      { id: 'tuka',      hired: false, assignedTo: null, stars: 0, fragments: 0, mineCompTimer: TIMER_INIT },

    bully:  { id: 'bully',  hired: false, assignedTo: null, stars: 0, fragments: 0, mineCompTimer: TIMER_INIT },
    muna:   { id: 'muna',   hired: false, assignedTo: null, stars: 0, fragments: 0, mineCompTimer: TIMER_INIT },
    smoke:  { id: 'smoke',  hired: false, assignedTo: null, stars: 0, fragments: 0, mineCompTimer: TIMER_INIT },
    nupito: { id: 'nupito', hired: false, assignedTo: null, stars: 0, fragments: 0, mineCompTimer: TIMER_INIT },

    boxer: { id: 'boxer', hired: false, assignedTo: null, stars: 0, fragments: 0, mineCompTimer: TIMER_INIT },
    druh:  { id: 'druh',  hired: false,  assignedTo: null, stars: 0, fragments: 0, mineCompTimer: TIMER_INIT },
    gordo: { id: 'gordo', hired: false,  assignedTo: null, stars: 0, fragments: 0, mineCompTimer: TIMER_INIT },
    zeus:  { id: 'zeus',  hired: false,  assignedTo: null, stars: 0, fragments: 0, mineCompTimer: TIMER_INIT },
};
