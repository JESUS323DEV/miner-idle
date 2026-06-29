import { useEffect } from 'react';

const TICK_INTERVAL_MS = 30000;
const CONSUME_PER_TICK = 2;
const GOLD_PER_CLIENT = 300;

export function computeTavernClients(stock) {
    const minStock = Math.min(stock?.comida ?? 0, stock?.cerveza ?? 0);
    return minStock >= 11 ? 11
        : minStock >= 6 ? 6
        : minStock >= 4 ? 4
        : minStock >= 2 ? 2
        : 0;
}

export const useTavernTick = (setGameState) => {
    useEffect(() => {
        const interval = setInterval(() => {
            setGameState(prev => {
                if (!prev.bartenderHired) return prev;

                const stock = prev.tavernStock ?? {};
                const clients = computeTavernClients(stock);

                if (clients === 0) return prev;

                const goldEarned = clients * GOLD_PER_CLIENT;
                const comida = stock.comida ?? 0;
                const cerveza = stock.cerveza ?? 0;

                return {
                    ...prev,
                    tavernStock: {
                        ...stock,
                        comida: Math.max(0, comida - CONSUME_PER_TICK),
                        cerveza: Math.max(0, cerveza - CONSUME_PER_TICK),
                    },
                    gold: prev.gold + goldEarned,
                    totalGoldEarned: (prev.totalGoldEarned ?? 0) + goldEarned,
                    tavernLastTick: Date.now(),
                };
            });
        }, TICK_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [setGameState]);
};
