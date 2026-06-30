import { useEffect } from 'react';
import { TavernConfig } from '../config/TavernConfig.js';

const TICK_INTERVAL_MS = 30000;
const CONSUME_PER_TICK = 2;

const GOLD_PER_TIER = {
    2:  800,
    4:  2000,
    6:  5000,
    11: 12000,
};

export function computeTavernClients(stock) {
    const minStock = Math.min(stock?.comida ?? 0, stock?.cerveza ?? 0);
    return minStock >= 11 ? 11
        : minStock >= 6 ? 6
        : minStock >= 4 ? 4
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
                    if (current === 0) {
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
