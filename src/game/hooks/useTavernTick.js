import { useEffect } from 'react';
import { TavernConfig } from '../config/TavernConfig.js';

const TICK_INTERVAL_MS = 30000;

const GOLD_PER_TIER = {
    2:  800,
    3:  1200,
    4:  2000,
    5:  3000,
    6:  4500,
    8:  6000,
    10: 12000,
};

export function computeTavernClients(stock) {
    const cerveza = stock?.cerveza ?? 0;
    return cerveza >= 10 ? 10
        : cerveza >= 8  ? 8
        : cerveza >= 6  ? 6
        : cerveza >= 5  ? 5
        : cerveza >= 4  ? 4
        : cerveza >= 3  ? 3
        : cerveza >= 2  ? 2
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

                const cerveza = stock.cerveza ?? 0;
                const consume = clients + 1;
                const goldEarned = GOLD_PER_TIER[clients] ?? 0;

                return {
                    ...prev,
                    tavernStock: { ...stock, cerveza: Math.max(0, cerveza - consume) },
                    gold: prev.gold + goldEarned,
                    tavernLastTick: Date.now(),
                };
            });
        }, TICK_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [setGameState]);

    // Perro de taberna: recompra provisiones automáticamente
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
