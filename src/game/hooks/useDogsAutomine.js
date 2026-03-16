import { useEffect } from 'react';
import { DogsConfig } from '../config/DogsConfig';

const useDogsAutomine = (gameState, handleDogTick) => {
    useEffect(() => {
        const intervals = Object.values(gameState.dogs)
            .filter(d => d && typeof d === 'object' && d.hired && d.assignedTo !== null)
            .map(dog => {
                const speed = DogsConfig[dog.id]?.miningSpeed || 5;
                return setInterval(() => {
                    handleDogTick(dog.id);
                }, speed * 1000);
            });

        return () => intervals.forEach(clearInterval);
    }, [
        gameState.dogs.lady.assignedTo,
        gameState.dogs.tokio.assignedTo,
        gameState.dogs.tuka.assignedTo,
        gameState.dogs.lady.hired,
        gameState.dogs.tokio.hired,
        gameState.dogs.tuka.hired,
        gameState.dogs.muna?.assignedTo,
        gameState.dogs.gordo?.assignedTo,
        gameState.dogs.druh?.assignedTo,
        gameState.dogs.smoke?.assignedTo,
        gameState.dogs.muna?.hired,
        gameState.dogs.gordo?.hired,
        gameState.dogs.druh?.hired,
        gameState.dogs.smoke?.hired,
        gameState.dogs.nupito?.assignedTo,
        gameState.dogs.zeus?.assignedTo,
        gameState.dogs.nupito?.hired,
        gameState.dogs.zeus?.hired,
    ]);
};

export default useDogsAutomine;