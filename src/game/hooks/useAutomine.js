import { useEffect } from 'react';
import { AutomineConfig } from '../config/AutomineConfig.js';

const useAutomine = (gameState, handleMineClick, handleStopAutomine) => {
    useEffect(() => {
        if (!gameState.automine?.isActive) return;

        const interval = setInterval(() => {
            if (gameState.stamina <= 0 || gameState.pickaxe.durability <= 0) {
                handleStopAutomine();
                return;
            }

            // ✅ Busca por data-attribute (más robusto)
            const menaElement = document.querySelector('[data-gold-mine="true"]');

            if (menaElement) {
                const rect = menaElement.getBoundingClientRect();

                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    clientX: rect.left + (rect.width / 2),
                    clientY: rect.top + (rect.height / 2)
                });

                menaElement.dispatchEvent(clickEvent);
            } else {
                // Fallback
                handleMineClick();
            }
        }, AutomineConfig.clickInterval);

        return () => clearInterval(interval);
    }, [gameState.automine?.isActive, gameState.stamina, gameState.pickaxe.durability, handleMineClick, handleStopAutomine]);
};

export default useAutomine;