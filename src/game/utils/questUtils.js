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

export const advanceDailyQuest = (setGameState, type, amount = 1) => {
    setGameState(prev => {
        const updated = advanceDailyQuestInState(prev.dailyQuests, type, amount);
        return updated === prev.dailyQuests ? prev : { ...prev, dailyQuests: updated };
    });
};
