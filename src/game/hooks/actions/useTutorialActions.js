export const useTutorialActions = (gameState, setGameState) => {

    const handleTutorialStep = (step) => {
        setGameState(prevState => ({
            ...prevState,
            tutorial: { ...prevState.tutorial, currentStep: step }
        }));
    };

    const handleUnlockTutorialFeature = (feature) => {
        setGameState(prevState => ({
            ...prevState,
            tutorial: { ...prevState.tutorial, [`${feature}Unlocked`]: true }
        }));
    };

    const handleCompleteTutorial = () => {
        setGameState(prevState => ({
            ...prevState,
            tutorial: { ...prevState.tutorial, completed: true, currentStep: 3 }
        }));
    };

    return {
        handleTutorialStep,
        handleUnlockTutorialFeature,
        handleCompleteTutorial,
    };
};
