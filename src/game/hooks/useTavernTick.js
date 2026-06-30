import { useEffect } from 'react';
import { TavernConfig } from '../config/TavernConfig.js';

const TICK_INTERVAL_MS = 30000;
const CONSUME_PER_TICK = 2;

const GOLD_PER_TIER = {
    2:  800,
    3:  1200,
    4:  2000,
    5:  3000,
    8:  6000,
    10: 12000,
};

export function computeTavernClients(stock) {
    const minStock = stock?.cerveza ?? 0;
    return minStock >= 10 ? 10
        : minStock >= 8 ? 8
        : minStock >= 5 ? 5
        : minStock >= 4 ? 4
        : minStock >= 3 ? 3
        : minStock >= 2 ? 2
        : 0;
}

export function computeTavernGold(clients) {
    return GOLD_PER_TIER[clients] ?? 0;
}

export const useTavernTick = (setGameState) => {
    useEffect(() => {
        const interval = setInterval(() => {
            setGameState(prev => {
                if (!prev.bartenderHired) return prev;

                const stock = prev.tavernStock ?? {};
                const clients = computeTavernClients(stock);

                if (clients === 0) return prev;

                const goldEarned = computeTavernGold(clients);
                const cerveza = stock.cerveza ?? 0;

                return {
                    ...prev,
                    tavernStock: {
                        ...stock,
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

    useEffect(() => {
        const interval = setInterval(() => {
            setGameState(prev => {
                if (!prev.bartenderHired || !prev.tavernDogSlot) return prev;

                const stock = prev.tavernStock ?? {};
                const materialsMax = prev.tavernProvisionMaxStock ?? TavernConfig.provisionsMaxStock;
                let newStock = { ...stock };
                let gold = prev.gold;
                let changed = false;

                for (const prov of TavernConfig.provisions) {
                    const current = newStock[prov.id] ?? 0;
                    if (current <= 1) {
                        const needed = materialsMax - current;
                        const total = prov.costPerUnit * needed;
                        if (gold >= total) {
                            newStock[prov.id] = materialsMax;
                            gold -= total;
                            changed = true;
                        }
                    }
                }

                if (!changed) return prev;
                return { ...prev, tavernStock: newStock, gold };
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [setGameState]);
};
