import { ALL_DAILY_QUESTS } from '../config/QuestsConfig.js';

export const advanceDailyQuestInState = (dq, type, amount = 1) => {
    if (!dq?.activeQuestIds?.length) return dq;
    const relevant = dq.activeQuestIds.filter(id => {
        const q = ALL_DAILY_QUESTS.find(q => q.id === id);
        return q?.type === type;
    });
    if (!relevant.length) return dq;
    const newProgress = { ...dq.progress };
    relevant.forEach(id => {
        const q = ALL_DAILY_QUESTS.find(q => q.id === id);
        if (q) newProgress[id] = Math.min((newProgress[id] ?? 0) + amount, q.target);
    });
    return { ...dq, progress: newProgress };
};

export const setDailyQuestMaxInState = (dq, type, value) => {
    if (!dq?.activeQuestIds?.length) return dq;
    const relevant = dq.activeQuestIds.filter(id => {
        const q = ALL_DAILY_QUESTS.find(q => q.id === id);
        return q?.type === type;
    });
    if (!relevant.length) return dq;
    const newProgress = { ...dq.progress };
    let changed = false;
    relevant.forEach(id => {
        const q = ALL_DAILY_QUESTS.find(q => q.id === id);
        if (q) {
            const newVal = Math.min(value, q.target);
            if (newVal > (newProgress[id] ?? 0)) { newProgress[id] = newVal; changed = true; }
        }
    });
    return changed ? { ...dq, progress: newProgress } : dq;
};

// ===== PJ QUESTS =====

const DEFAULT_PJ = { slotTimeMs: 0, slotEnteredAt: null, passiveRaids: 0, mineUses: 0, activeUses: 0, claimedMissions: [], finalClaimed: false };

export const enterPJSlot = (pjQuests, dogId) => {
    const prev = pjQuests?.[dogId] ?? DEFAULT_PJ;
    if (prev.slotEnteredAt) return pjQuests;
    return { ...(pjQuests ?? {}), [dogId]: { ...DEFAULT_PJ, ...prev, slotEnteredAt: Date.now() } };
};

export const leavePJSlot = (pjQuests, dogId) => {
    const prev = pjQuests?.[dogId];
    if (!prev?.slotEnteredAt) return pjQuests ?? {};
    return {
        ...(pjQuests ?? {}),
        [dogId]: { ...prev, slotTimeMs: (prev.slotTimeMs ?? 0) + (Date.now() - prev.slotEnteredAt), slotEnteredAt: null },
    };
};

export const advancePJRaids = (pjQuests, dogId) => {
    const prev = pjQuests?.[dogId] ?? DEFAULT_PJ;
    return { ...(pjQuests ?? {}), [dogId]: { ...DEFAULT_PJ, ...prev, passiveRaids: (prev.passiveRaids ?? 0) + 1 } };
};

export const advancePJMineUse = (pjQuests, dogId) => {
    const prev = pjQuests?.[dogId] ?? DEFAULT_PJ;
    return { ...(pjQuests ?? {}), [dogId]: { ...DEFAULT_PJ, ...prev, mineUses: (prev.mineUses ?? 0) + 1 } };
};

export const advancePJActiveUse = (pjQuests, dogId) => {
    const prev = pjQuests?.[dogId] ?? DEFAULT_PJ;
    return { ...(pjQuests ?? {}), [dogId]: { ...DEFAULT_PJ, ...prev, activeUses: (prev.activeUses ?? 0) + 1 } };
};

export const getPJSlotTimeMs = (pjQuests, dogId) => {
    const d = pjQuests?.[dogId];
    if (!d) return 0;
    return (d.slotTimeMs ?? 0) + (d.slotEnteredAt ? Date.now() - d.slotEnteredAt : 0);
};

export const advanceDailyQuest = (setGameState, type, amount = 1) => {
    setGameState(prev => {
        const updated = advanceDailyQuestInState(prev.dailyQuests, type, amount);
        return updated === prev.dailyQuests ? prev : { ...prev, dailyQuests: updated };
    });
};
