export const DAILY_QUESTS_FIXED = [
    { id: 'mine_gold_1',     label: 'Mina 500 de oro',                   target: 500,  type: 'goldMined',      reward: { coins: 2 } },
    { id: 'repair_10',       label: 'Repara 10 veces',                   target: 10,   type: 'repairs',        reward: { coins: 2 } },
    { id: 'burst_10',        label: 'Usa el burst 10 veces',             target: 10,   type: 'burstUses',      reward: { coins: 3 } },
    { id: 'combo_10',        label: 'Llega a combo 10',                  target: 10,   type: 'maxCombo',       reward: { coins: 1 } },
    { id: 'passive_send_1',  label: 'Envía 1 expedición',                target: 1,    type: 'passiveSent',    reward: { coins: 2 } },
    { id: 'active_win_1',    label: 'Gana un asalto',                    target: 1,    type: 'activeWins',     reward: { coins: 10 } },
    { id: 'tavern_visit',    label: 'Visita la taberna',                 target: 1,    type: 'tavernVisits',   reward: { coins: 1 } },
    { id: 'card_buy_1',      label: 'Compra 1 carta en taberna',         target: 1,    type: 'cardsBought',    reward: { coins: 2 } },
    { id: 'dog_assign',      label: 'Asigna un perro a la mina',         target: 1,    type: 'dogsAssigned',   reward: { coins: 1 } },
    { id: 'passive_claim_1', label: 'Reclama 1 expedición',              target: 1,    type: 'passiveClaimed', reward: { coins: 2 } },
];

export const DAILY_QUESTS_EXTRA_20 = [
    { id: 'mine_gold_2',     label: 'Mina 2000 de oro',                  target: 2000, type: 'goldMined',      reward: { coins: 2 } },
    { id: 'combo_20',        label: 'Llega a combo 20',                  target: 20,   type: 'maxCombo',       reward: { coins: 2 } },
    { id: 'mine_60s',        label: 'Mina durante 60 segundos',          target: 60,   type: 'mineTime',       reward: { coins: 2 } },
    { id: 'burst_3row',      label: 'Usa el burst 3 veces seguidas',     target: 3,    type: 'burstRow',       reward: { coins: 2 } },
    { id: 'passive_3',       label: 'Ten 3 expediciones activas',        target: 3,    type: 'passiveActive',  reward: { coins: 3 } },
    { id: 'passive_shards',  label: 'Consigue shards en una pasiva',     target: 1,    type: 'passiveShards',  reward: { coins: 3 } },
    { id: 'passive_team3',   label: 'Envía equipo de 3 perros a pasiva', target: 1,    type: 'passiveTeam3',   reward: { coins: 2 } },
    { id: 'passive_epic',    label: 'Completa una pasiva épica o mejor', target: 1,    type: 'passiveEpic',    reward: { coins: 4 } },
    { id: 'active_no_loss',  label: 'Gana una activa sin perder perros', target: 1,    type: 'activeNoLoss',   reward: { coins: 4 } },
    { id: 'active_fast',     label: 'Completa un asalto',                target: 1,    type: 'activeWins',     reward: { coins: 2 } },
    { id: 'active_ability',  label: 'Usa una habilidad en un asalto',    target: 1,    type: 'abilityUses',    reward: { coins: 2 } },
    { id: 'active_3',        label: 'Gana 3 asaltos',                    target: 3,    type: 'activeWins',     reward: { coins: 5 } },
    { id: 'tavern_spend',    label: 'Gasta 100 monedas de taberna',      target: 100,  type: 'coinsSpent',     reward: { coins: 3 } },
    { id: 'tavern_rare',     label: 'Consigue una carta rara o superior',target: 1,    type: 'rareCards',      reward: { coins: 4 } },
    { id: 'tavern_buy_3',    label: 'Compra 3 cartas en una visita',     target: 3,    type: 'cardsBought',    reward: { coins: 3 } },
    { id: 'play_5min',       label: 'Juega 5 minutos',                   target: 300,  type: 'playTime',       reward: { coins: 2 } },
    { id: 'mine_full',       label: 'Ten todos los slots de mina llenos',target: 1,    type: 'mineFullSlots',  reward: { coins: 2 } },
    { id: 'dog_star_up',     label: 'Sube de nivel a un perro',          target: 1,    type: 'starUps',        reward: { coins: 3 } },
    { id: 'open_today',      label: 'Abre el juego hoy',                 target: 1,    type: 'openGame',       reward: { coins: 1 } },
    { id: 'complete_5',      label: 'Completa 5 misiones diarias',       target: 5,    type: 'questsDone',     reward: { coins: 5 } },
];

export const ALL_DAILY_QUESTS = [...DAILY_QUESTS_FIXED, ...DAILY_QUESTS_EXTRA_20];

export const getQuestById = (id) => ALL_DAILY_QUESTS.find(q => q.id === id);
export const getQuestsByIds = (ids) => ids.map(id => ALL_DAILY_QUESTS.find(q => q.id === id)).filter(Boolean);
