// ============================================================
//  GACHA CONFIG — Sobres de invocación
// ============================================================

export const PACK_TYPES = {
    basic: {
        id: 'basic',
        name: 'Básico',
        cost: 3,
        rates: { rare: 0.70, epic: 0.25, legendary: 0.05 },
        pity: { epic: 30, legendary: 80 },
    },
    epic: {
        id: 'epic',
        name: 'Épico',
        cost: 8,
        rates: { rare: 0, epic: 0.70, legendary: 0.30 },
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

// Fragmentos que da cada rareza al abrir un sobre
export const FRAGMENTS_PER_RARITY = {
    rare: 10,
    epic: 15,
    legendary: 20,
};
