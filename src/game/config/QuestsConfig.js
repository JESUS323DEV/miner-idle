export const DAILY_QUESTS_FIXED = [
    { id: 'mine_gold_1',     label: 'Mina 1000 de oro',                  target: 1000, type: 'goldMined',      reward: { coins: 2 } },
    { id: 'repair_10',       label: 'Repara 10 veces',                   target: 10,   type: 'repairs',        reward: { coins: 2 } },
    { id: 'burst_10',        label: 'Usa el burst 10 veces',             target: 10,   type: 'burstUses',      reward: { coins: 2 } },
    { id: 'combo_10',        label: 'Llega a combo 10',                  target: 10,   type: 'maxCombo',       reward: { coins: 1 } },
    { id: 'passive_send_1',  label: 'Envía 1 expedición',                target: 1,    type: 'passiveSent',    reward: { coins: 2 } },
    { id: 'mine_gold_3k',    label: 'Mina 3000 de oro',                  target: 3000, type: 'goldMined',      reward: { coins: 4 } },
    { id: 'tavern_visit',    label: 'Visita la taberna',                 target: 1,    type: 'tavernVisits',   reward: { coins: 1 } },
    { id: 'play_5min_1',     label: 'Juega durante 5 minutos',           target: 300,  type: 'playTime',       reward: { coins: 2 } },
    { id: 'dog_assign',      label: 'Asigna un perro a la mina',         target: 1,    type: 'dogsAssigned',   reward: { coins: 1 } },
    { id: 'passive_claim_1', label: 'Reclama 1 expedición',              target: 1,    type: 'passiveClaimed', reward: { coins: 2 } },
];

export const DAILY_QUESTS_DAY2 = [
    { id: 'mine_gold_5k',      label: 'Mina 5000 de oro',                   target: 5000, type: 'goldMined',      reward: { coins: 5 } },
    { id: 'automine_uses_10',  label: 'Usa el autominar 10 veces',          target: 10,   type: 'automineUses',   reward: { coins: 5 } },
    { id: 'combo_25',          label: 'Llega a combo 25',                   target: 25,   type: 'maxCombo',       reward: { coins: 3 } },
    { id: 'play_5min_2',       label: 'Juega durante 5 minutos',            target: 300,  type: 'playTime',       reward: { coins: 5 } },
    { id: 'repair_20',         label: 'Repara 20 veces',                    target: 20,   type: 'repairs',        reward: { coins: 3 } },
    { id: 'passive_send_5',    label: 'Envía 5 expediciones',               target: 5,    type: 'passiveSent',    reward: { coins: 6 } },
    { id: 'burst_15',          label: 'Usa el burst 15 veces',              target: 15,   type: 'burstUses',      reward: { coins: 6 } },
    { id: 'mine_entries_3_d2', label: 'Entra en cualquier mina 3 veces',    target: 3,    type: 'mineEntries',    reward: { coins: 4 } },
    { id: 'poder_uses_3',      label: 'Usa recarga 3 veces',                target: 3,    type: 'poderUses',      reward: { coins: 2 } },
    { id: 'rental_assigned_1', label: 'Asigna un perro de alquiler', target: 1, type: 'rentalAssigned', reward: { coins: 4 } },
];

export const DAILY_QUESTS_EXTRA_20 = [
    { id: 'mine_gold_2',     label: 'Mina 2000 de oro',                  target: 2000, type: 'goldMined',      reward: { coins: 2 } },
    { id: 'combo_20',        label: 'Llega a combo 20',                  target: 20,   type: 'maxCombo',       reward: { coins: 2 } },
    { id: 'passive_3',       label: 'Ten 3 expediciones activas',        target: 3,    type: 'passiveActive',  reward: { coins: 3 } },
    { id: 'passive_shards',  label: 'Consigue shards en una pasiva',     target: 1,    type: 'passiveShards',  reward: { coins: 3 } },
    { id: 'passive_team3',   label: 'Envía equipo de 3 perros a pasiva', target: 1,    type: 'passiveTeam3',   reward: { coins: 2 } },
    { id: 'passive_epic',    label: 'Completa una pasiva épica o mejor', target: 1,    type: 'passiveEpic',    reward: { coins: 4 } },
    { id: 'active_no_loss',  label: 'Gana una activa sin perder perros', target: 1,    type: 'activeNoLoss',   reward: { coins: 4 } },
    { id: 'active_fast',     label: 'Completa un asalto',                target: 1,    type: 'activeWins',     reward: { coins: 2 } },
    { id: 'active_ability',  label: 'Usa una habilidad en un asalto',    target: 1,    type: 'abilityUses',    reward: { coins: 2 } },
    { id: 'active_3',        label: 'Gana 3 asaltos',                    target: 3,    type: 'activeWins',     reward: { coins: 5 } },
    { id: 'tavern_rare',     label: 'Consigue una carta rara o superior',target: 1,    type: 'rareCards',      reward: { coins: 4 } },
    { id: 'tavern_buy_3',    label: 'Compra 3 cartas en una visita',     target: 3,    type: 'cardsBought',    reward: { coins: 3 } },
    { id: 'play_5min',       label: 'Juega 5 minutos',                   target: 300,  type: 'playTime',       reward: { coins: 2 } },
    { id: 'mine_full',       label: 'Ten todos los slots de mina llenos',target: 1,    type: 'mineFullSlots',  reward: { coins: 2 } },
    { id: 'dog_star_up',     label: 'Sube de nivel a un perro',          target: 1,    type: 'starUps',        reward: { coins: 3 } },
    { id: 'open_today',      label: 'Abre el juego hoy',                 target: 1,    type: 'openGame',       reward: { coins: 1 } },
    { id: 'complete_5',      label: 'Completa 5 misiones diarias',       target: 5,    type: 'questsDone',     reward: { coins: 5 } },
];

export const DAILY_QUESTS_DAY3 = [
    { id: 'mine_gold_15k',    label: 'Mina 15000 de oro',                  target: 15000, type: 'goldMined',       reward: { coins: 7 } },
    { id: 'passive_team3_d3', label: 'Envía equipo de 3 perros a pasiva',  target: 1,     type: 'passiveTeam3',    reward: { coins: 8 } },
    { id: 'combo_30',         label: 'Llega a combo 30',                   target: 30,    type: 'maxCombo',        reward: { coins: 5 } },
    { id: 'play_10min',       label: 'Juega durante 10 minutos',           target: 600,   type: 'playTime',        reward: { coins: 8 } },
    { id: 'passive_shards_d3',label: 'Consigue shards en una pasiva',      target: 1,     type: 'passiveShards',   reward: { coins: 6 } },
    { id: 'passive_send_15',  label: 'Envía 15 expediciones',              target: 15,    type: 'passiveSent',     reward: { coins: 6 } },
    { id: 'roulette_spin_1',  label: 'Haz una tirada en la ruleta de oro', target: 1,     type: 'rouletteSpin',    reward: { coins: 5 } },
    { id: 'mine_entries_3',   label: 'Entra en cualquier mina 3 veces',    target: 3,     type: 'mineEntries',     reward: { coins: 4 } },
    { id: 'open_pack_1',      label: 'Abre un sobre rare o superior',      target: 1,     type: 'rareCards',       reward: { coins: 8 } },
    { id: 'cambista_coins_2', label: 'Consigue 2 monedas con lingotes en el comerciante', target: 2, type: 'coinsFromIngots', reward: { coins: 4 } },
];

export const ALL_DAILY_QUESTS = [...DAILY_QUESTS_FIXED, ...DAILY_QUESTS_DAY2, ...DAILY_QUESTS_EXTRA_20, ...DAILY_QUESTS_DAY3];

export const getQuestById = (id) => ALL_DAILY_QUESTS.find(q => q.id === id);
export const getQuestsByIds = (ids) => ids.map(id => ALL_DAILY_QUESTS.find(q => q.id === id)).filter(Boolean);
