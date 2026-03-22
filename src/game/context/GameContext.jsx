import { createContext, useContext } from 'react';

export const GameContext = createContext(null);

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGameContext debe usarse dentro de GameContext.Provider');
    return context;
};
