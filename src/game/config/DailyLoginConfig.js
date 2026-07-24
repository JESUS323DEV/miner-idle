export const DAILY_LOGIN_REWARDS = [
    { day: 1, type: 'gold',   amount: 500 },
    { day: 2, type: 'coins',  amount: 2 },
    { day: 3, type: 'gold',   amount: 1500 },
    { day: 4, type: 'shards', rarity: 'rare',      amount: 20 },
    { day: 5, type: 'gold',   amount: 3000 },
    { day: 6, type: 'coins',  amount: 5 },
    { day: 7, type: 'shards', rarity: 'legendary',  amount: 50 },
];

const today = () => new Date().toISOString().split('T')[0];

export const getDailyLoginState = (dailyLogin) => {
    const streak = dailyLogin?.streak ?? 0;
    const lastDate = dailyLogin?.lastClaimedDate ?? null;
    const todayStr = today();

    if (!lastDate) return { currentStreak: 0, availableDay: 1, claimedToday: false };
    if (lastDate === todayStr) return { currentStreak: streak, availableDay: null, claimedToday: true };

    const diffDays = Math.round((new Date(todayStr) - new Date(lastDate)) / 86400000);

    if (diffDays === 1) {
        if (streak >= 7) return { currentStreak: 0, availableDay: 1, claimedToday: false };
        return { currentStreak: streak, availableDay: streak + 1, claimedToday: false };
    }

    // Racha rota
    return { currentStreak: 0, availableDay: 1, claimedToday: false, streakBroken: true };
};
