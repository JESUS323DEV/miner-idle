const MineSnacksConfig = {

    automine: {
        id: 'automine',
        name: 'Auto-pico',
        emoji: '⚙️',
        description: 'Mina solo durante 10s',
        costGold: 500,
        chargesPerBuy: 2,
        duration: 10000,
        interval: 166,
    },

    dynamite: {
        id: 'dynamite',
        name: 'Dinamita',
        emoji: '💥',
        description: 'Vacía todas las venas al instante',
        costGold: 150,
        chargesPerBuy: 2,
    },

    toughness: {
        id: 'toughness',
        name: 'Refuerzo',
        emoji: '🛡️',
        description: '30% por golpe sin coste de stamina/pico (15s)',
        costGold: 300,
        chargesPerBuy: 2,
        duration: 15000,
    },

};

export default MineSnacksConfig;
