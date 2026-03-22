import { useGoldActions } from './actions/useGoldActions.js';
import { usePickaxeActions } from './actions/usePickaxeActions.js';
import { useMineActions } from './actions/useMineActions.js';
import { useTutorialActions } from './actions/useTutorialActions.js';
import { useSnackActions } from './actions/useSnackActions.js';
import { useTavernActions } from './actions/useTavernActions.js';
import { useAutomineActions } from './actions/useAutomineActions.js';
import { useForgeActions } from './actions/useForgeActions.js';
import { useRewardsActions } from './actions/useRewardsActions.js';
import { useYacimientoActions } from './actions/useYacimientoActions.js';
import { useDogsActions } from './actions/useDogsActions.js';

export const useGameActions = (gameState, setGameState, showGoldCost, showTavernCost, showGoldGain, showTavernGain) => {
    return {
        ...useGoldActions(gameState, setGameState, showGoldCost, showTavernCost),
        ...usePickaxeActions(gameState, setGameState, showGoldCost),
        ...useMineActions(gameState, setGameState, showGoldCost),
        ...useTutorialActions(gameState, setGameState),
        ...useSnackActions(gameState, setGameState),
        ...useTavernActions(gameState, setGameState, showGoldCost, showTavernCost, showTavernGain),
        ...useAutomineActions(gameState, setGameState, showGoldCost),
        ...useForgeActions(gameState, setGameState, showGoldCost),
        ...useRewardsActions(gameState, setGameState, showGoldGain, showTavernGain),
        ...useYacimientoActions(gameState, setGameState),
        ...useDogsActions(gameState, setGameState),

        // Lady (pendiente de implementar)
        handleFeedLady: () => { },
    };
};
