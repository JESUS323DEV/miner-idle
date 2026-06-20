import { useEffect } from 'react';
import { DogsConfig } from '../config/DogsConfig.js';
import { getDogStats } from '../utils/getDogStats.js';

const useDogsAutomine = (gameState, handleDogTick) => {
    useEffect(() => {
        const intervals = Object.values(gameState.dogs)
            .filter(d => d && typeof d === 'object' && d.hired && d.assignedTo !== null && d.assignedTo.globalSlot === undefined && !d.assignedTo?.isMineCompanion)
            .map(dog => {
                const stats = getDogStats(dog.id, dog.stars ?? 0);
                const speed = stats?.miningSpeed ?? DogsConfig[dog.id]?.miningSpeed ?? 1;
                const interval = Math.round(speed * 2000);
                return setInterval(() => {
                    handleDogTick(dog.id);
                }, interval);
            });

        return () => intervals.forEach(clearInterval);
    }, [
        gameState.dogs.lady?.assignedTo,
        gameState.dogs.tokio?.assignedTo,
        gameState.dogs.tuka?.assignedTo,
        gameState.dogs.muna?.assignedTo,
        gameState.dogs.gordo?.assignedTo,
        gameState.dogs.druh?.assignedTo,
        gameState.dogs.smoke?.assignedTo,
        gameState.dogs.nupito?.assignedTo,
        gameState.dogs.zeus?.assignedTo,
        gameState.dogs.boxer?.assignedTo,
        gameState.dogs.bully?.assignedTo,
        gameState.dogs.chihuahua?.assignedTo,
        gameState.dogs.lady?.hired,
        gameState.dogs.tokio?.hired,
        gameState.dogs.tuka?.hired,
        gameState.dogs.muna?.hired,
        gameState.dogs.gordo?.hired,
        gameState.dogs.druh?.hired,
        gameState.dogs.smoke?.hired,
        gameState.dogs.nupito?.hired,
        gameState.dogs.zeus?.hired,
        gameState.dogs.boxer?.hired,
        gameState.dogs.bully?.hired,
        gameState.dogs.chihuahua?.hired,
        gameState.dogs.lady?.stars,
        gameState.dogs.tokio?.stars,
        gameState.dogs.tuka?.stars,
        gameState.dogs.muna?.stars,
        gameState.dogs.gordo?.stars,
        gameState.dogs.druh?.stars,
        gameState.dogs.smoke?.stars,
        gameState.dogs.nupito?.stars,
        gameState.dogs.zeus?.stars,
        gameState.dogs.boxer?.stars,
        gameState.dogs.bully?.stars,
        gameState.dogs.chihuahua?.stars,
    ]);
};

export default useDogsAutomine;
