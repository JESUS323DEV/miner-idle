// Precio por CONCEPTO en rare/epic (menos repetido entre perros = más caro).
// Legendaria se precia por PERRO (menos opciones tiene ese perro = más caro), a propósito.
const CONCEPT_PRICE = {
    rey: 10, reina: 10,
    minero: 15, minera: 15,
    cascos: 20,
    mago: 30, maga: 30,
};

const LEGENDARY_PRICE_BY_COUNT = { 3: 50, 2: 40, 1: 100 };

// Tavern Coins: precio plano por tier (no varía por concepto/perro como el Huesín).
const TAVERN_PRICE_BY_TIER = { rare: 5, epic: 10, legendary: 20 };

const RAW_SKINS = {
    druh:   { cascos: 'epic', mago: 'epic', minero: 'rare', rey: 'rare', señor: 'legendary' },
    gordo:  { mago: 'epic', cascos: 'epic', chef: 'legendary', gafas: 'legendary', rey: 'rare', señor: 'legendary' },
    lady:   { capucha: 'legendary', cascos: 'epic', gafas: 'legendary', minera: 'rare', pirata: 'legendary', reina: 'rare' },
    muna:   { cascos: 'epic', minera: 'rare', piloto: 'legendary', pirata: 'legendary', reina: 'rare' },
    nupito: { mago: 'epic', minero: 'rare', rey: 'rare', sherif: 'legendary' },
    smoke:  { cascos: 'epic', mago: 'epic', minero: 'rare', rey: 'rare', señor: 'legendary' },
    tokio:  { capucha: 'legendary', cascos: 'epic', gafas: 'legendary', minera: 'rare', reina: 'rare' },
    tuka:   { capucha: 'legendary', cascos: 'epic', chef: 'legendary', gafas: 'legendary', maga: 'epic', minera: 'rare', reina: 'rare' },
    zeus:   { chef: 'legendary', mago: 'epic', minero: 'rare', rey: 'rare', sherif: 'legendary' },
};

const buildDogSkinsConfig = () => {
    const config = {};
    Object.entries(RAW_SKINS).forEach(([dogId, skins]) => {
        const legendaryCount = Object.values(skins).filter(tier => tier === 'legendary').length;
        const legendaryPrice = LEGENDARY_PRICE_BY_COUNT[legendaryCount] ?? 100;
        config[dogId] = Object.entries(skins).map(([skinId, tier]) => ({
            id: skinId,
            tier,
            huesinPrice: tier === 'legendary' ? legendaryPrice : (CONCEPT_PRICE[skinId] ?? 0),
            tavernPrice: TAVERN_PRICE_BY_TIER[tier] ?? 0,
        }));
    });
    return config;
};

// { [dogId]: [{ id, tier, price }] }
export const DogSkinsConfig = buildDogSkinsConfig();
