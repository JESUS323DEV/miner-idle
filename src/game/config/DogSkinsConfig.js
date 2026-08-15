// Precio por CONCEPTO en rare/epic (menos repetido entre perros = más caro).
// Legendaria se precia por PERRO (menos opciones tiene ese perro = más caro), a propósito.
// Rare: Tavern Coins plano por tier (ver TAVERN_PRICE_BY_TIER). Epic: Tavern Coins también varía por concepto.
const CONCEPT_PRICE = {
    rey: { huesin: 10 },
    reina: { huesin: 10 },
    minero: { huesin: 15 },
    minera: { huesin: 15 },
    cascos: { huesin: 60, tavern: 30 },
    mago: { huesin: 80, tavern: 40 },
    maga: { huesin: 80, tavern: 40 },
};

const LEGENDARY_PRICE_BY_COUNT = { 3: 150, 2: 120, 1: 300 };

// Tavern Coins: precio plano por tier para rare/legendaria (no varía por concepto/perro).
const TAVERN_PRICE_BY_TIER = { rare: 5, legendary: 60 };

const RAW_SKINS = {
    druh:   { cascos: 'epic', mago: 'epic', minero: 'rare', rey: 'rare', señor: 'legendary' },
    gordo:  { mago: 'epic', cascos: 'epic', chef: 'legendary', gafas: 'legendary', rey: 'rare', señor: 'legendary' },
    lady:   { capucha: 'legendary', cascos: 'epic', gafas: 'legendary', minera: 'rare', pirata: 'legendary', reina: 'rare' },
    muna:   { cascos: 'epic', minera: 'rare', piloto: 'legendary', pirata: 'legendary', reina: 'rare' },
    nupito: { mago: 'epic', minero: 'rare', rey: 'rare', sherif: 'legendary' },
    smoke:  {}, // assets descartados (la IA falló mucho con este perro), pendiente de rehacer
    tokio:  { capucha: 'legendary', cascos: 'epic', gafas: 'legendary', minera: 'rare', reina: 'rare' },
    tuka:   { capucha: 'legendary', cascos: 'epic', chef: 'legendary', gafas: 'legendary', maga: 'epic', minera: 'rare', reina: 'rare' },
    zeus:   { chef: 'legendary', mago: 'epic', minero: 'rare', rey: 'rare', sherif: 'legendary' },
};

// Skins ya generadas pero ocultas por ahora (se reservan para lanzarlas más adelante como contenido nuevo).
// El precio de legendaria sigue calculándose sobre el conteo ORIGINAL (incluyendo estas), sin recalcular.
const HIDDEN_SKINS = {
    druh: ['minero'],
    gordo: ['chef'],
    lady: ['pirata'],
    tuka: ['chef', 'maga'],
};

// Skins "Ultimate": únicas por perro, con progresión propia ligada a estrellas, no siguen el sistema
// de precio-por-concepto de arriba. Fase 1 se compra normal (Huesín+Tavern Coins, muy cara).
// Fase 2 NO se compra: se desbloquea sola al llegar a 3 estrellas si ya tienes Fase 1
// (lógica real en handleUpgradeStar, useDogsActions.js). Precios de Fase 1 provisionales.
const ultimateSkinPair = (name) => [
    { id: 'fase1', tier: 'ultimate', huesinPrice: 500, tavernPrice: 150, loopWith: 'fase2', name },
    { id: 'fase2', tier: 'ultimate', huesinPrice: 0, tavernPrice: 0, starGated: 3, hiddenInShop: true },
];

const ULTIMATE_SKINS = {
    druh:   ultimateSkinPair('Druh Mask'),
    gordo:  ultimateSkinPair('Gordo Fox'),
    lady:   ultimateSkinPair('Lady AF'),
    muna:   ultimateSkinPair('Rambuna'),
    nupito: ultimateSkinPair('Nupito Chuk'),
    tokio:  ultimateSkinPair('Tokyo Hunter'),
    tuka:   ultimateSkinPair('Tuka-T420'),
    zeus:   ultimateSkinPair('Zoker'),
};

const buildDogSkinsConfig = () => {
    const config = {};
    Object.entries(RAW_SKINS).forEach(([dogId, skins]) => {
        const legendaryCount = Object.values(skins).filter(tier => tier === 'legendary').length;
        const legendaryPrice = LEGENDARY_PRICE_BY_COUNT[legendaryCount] ?? 100;
        const hidden = HIDDEN_SKINS[dogId] ?? [];
        config[dogId] = Object.entries(skins)
            .filter(([skinId]) => !hidden.includes(skinId))
            .map(([skinId, tier]) => ({
                id: skinId,
                tier,
                huesinPrice: tier === 'legendary' ? legendaryPrice : (CONCEPT_PRICE[skinId]?.huesin ?? 0),
                tavernPrice: tier === 'legendary' ? TAVERN_PRICE_BY_TIER.legendary : (CONCEPT_PRICE[skinId]?.tavern ?? TAVERN_PRICE_BY_TIER[tier] ?? 0),
            }));
    });
    Object.entries(ULTIMATE_SKINS).forEach(([dogId, skins]) => {
        config[dogId] = [...(config[dogId] ?? []), ...skins];
    });
    return config;
};

// { [dogId]: [{ id, tier, price }] }
export const DogSkinsConfig = buildDogSkinsConfig();
