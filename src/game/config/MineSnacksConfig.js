const MineSnacksConfig = {

    // Mina automáticamente sin consumir stamina ni durabilidad
    automine: {
        id: 'automine',
        name: 'Auto-pico',
        emoji: '⚙️',
        description: 'Mina solo durante 10s',
        costGold: 500,       // Precio en oro por recarga
        chargesPerBuy: 2,    // Cargas que da cada recarga
        duration: 10000,     // Duración en ms (10s)
        interval: 166,       // Ms entre golpes (~6 clicks/s)
    },

    // Vacía todas las venas de golpe, gain basado en promedio del pico
    dynamite: {
        id: 'dynamite',
        name: 'Dinamita',
        emoji: '💥',
        description: 'Vacía todas las venas al instante',
        costGold: 150,       // Precio en oro por recarga
        chargesPerBuy: 2,    // Cargas que da cada recarga
    },

    // Cada golpe tiene X% de no consumir stamina ni durabilidad
    toughness: {
        id: 'toughness',
        name: 'Refuerzo',
        emoji: '🛡️',
        description: '30% por golpe sin coste de stamina/pico (15s)',
        costGold: 300,       // Precio en oro por recarga
        chargesPerBuy: 2,    // Cargas que da cada recarga
        duration: 15000,     // Duración en ms (15s)
        procChance: 0.5,     // Probabilidad de no consumir por golpe (0-1)
    },

};

export default MineSnacksConfig;
