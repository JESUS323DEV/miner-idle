import { useEffect } from 'react';
import { TavernConfig } from '../config/TavernConfig.js';
import { DogsConfig } from '../config/DogsConfig.js';
import { ForgeDogsConfig } from '../config/ForgeDogsConfig.js';

const ORDER_TICK_INTERVAL_MS = 1000;

// Pedidos del tablón de envíos (Raids): reclama y reencadena solo mientras dure la ventana de auto-envío
export const useRaidOrdersTick = (setGameState) => {
    useEffect(() => {
        const interval = setInterval(() => {
            setGameState(prev => {
                const orders = prev.raidOrders ?? {};
                let changed = false;
                const newOrders = { ...orders };
                const newDogs = { ...prev.dogs };
                const newForgeDogs = { ...prev.forgeDogs };
                const newStock = { ...prev.tavernStock };
                let gold = prev.gold;
                const now = Date.now();
                const max = prev.tavernProvisionMaxStock ?? TavernConfig.provisionsMaxStock;

                for (const prov of TavernConfig.provisions) {
                    const matId = prov.id;
                    const order = newOrders[matId];
                    if (!order || !order.autoResend || now < order.returnAt) continue;

                    changed = true;
                    const current = newStock[matId] ?? 0;
                    newStock[matId] = Math.min(max, current + order.amount);

                    const roomLeft = max - newStock[matId];
                    const total = prov.costPerUnit * prov.buyAmount;
                    const canContinue = now < order.autoResendUntil && roomLeft >= prov.buyAmount && gold >= total;

                    if (canContinue) {
                        gold -= total;
                        const dog = order.isForge ? newForgeDogs[order.dogId] : newDogs[order.dogId];
                        const cfg = order.isForge ? ForgeDogsConfig[order.dogId] : DogsConfig[order.dogId];
                        const stars = dog?.stars ?? 0;
                        const mult = 1 + (cfg?.starBonus ?? 0) * stars;
                        const duration = TavernConfig.orders.duration / mult;
                        newOrders[matId] = {
                            ...order,
                            startedAt: now,
                            returnAt: now + duration * 1000,
                        };
                    } else {
                        if (order.isForge) {
                            if (newForgeDogs[order.dogId]) newForgeDogs[order.dogId] = { ...newForgeDogs[order.dogId], assignedTo: null };
                        } else {
                            if (newDogs[order.dogId]) newDogs[order.dogId] = { ...newDogs[order.dogId], assignedTo: null };
                        }
                        newOrders[matId] = null;
                    }
                }

                if (!changed) return prev;
                return { ...prev, raidOrders: newOrders, dogs: newDogs, forgeDogs: newForgeDogs, tavernStock: newStock, gold };
            });
        }, ORDER_TICK_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [setGameState]);
};
