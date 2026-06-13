// ============================================================
//  GACHA CONFIG — Sobres de invocación
// ============================================================

export const PACK_TYPES = {
    basic: {
        id: 'basic',
        name: 'Básico',
        cost: 5,
        rates: { rare: 0.88, epic: 0.10, legendary: 0.02 },
        pity: { epic: 30, legendary: 80 },
    },
    epic: {
        id: 'epic',
        name: 'Épico',
        cost: 10,
        rates: { rare: 0.10, epic: 0.85, legendary: 0.05 },
        pity: { epic: null, legendary: 40 },
    },
    legendary: {
        id: 'legendary',
        name: 'Legendario',
        cost: 20,
        rates: { rare: 0, epic: 0.20, legendary: 0.80 },
        pity: { epic: null, legendary: 20 },
    },
};

// Fragmentos que da cada rareza al abrir un sobre (pago)
export const FRAGMENTS_PER_RARITY = {
    rare: 20,
    epic: 20,
    legendary: 20,
};

// Fragmentos para invocaciones gratis (más rares, menos legendarias)
export const FREE_FRAGMENTS_PER_RARITY = {
    rare: 15,
    epic: 10,
    legendary: 5,
};
