export const PJ_MISSION_TEMPLATES = {
    rare: {
        missions: [
            { missionId: 'slot_time', label: 'Equípalo en el slot de oro 30 min acumulados', type: 'slotTime', target: 30 * 60 * 1000 },
            { missionId: 'passive_raids', label: 'Mándalo en 3 expediciones', type: 'passiveRaids', target: 3 },
        ],
        missionReward: 20,
        finalReward: 150,
    },
    epic: {
        missions: [
            { missionId: 'slot_time', label: 'Equípalo en el slot de oro 60 min acumulados', type: 'slotTime', target: 60 * 60 * 1000 },
            { missionId: 'passive_raids', label: 'Mándalo en 6 expediciones', type: 'passiveRaids', target: 6 },
        ],
        missionReward: 20,
        finalReward: 150,
    },
    legendary: {
        missions: [
            { missionId: 'slot_time', label: 'Equípalo en el slot de oro 120 min acumulados', type: 'slotTime', target: 120 * 60 * 1000 },
            { missionId: 'passive_raids', label: 'Mándalo en 10 expediciones', type: 'passiveRaids', target: 10 },
            // 3ª misión pendiente de definir
        ],
        missionReward: 20,
        finalReward: 150,
    },
};
