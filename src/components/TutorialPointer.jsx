import "../styles/tutorial.css"

const TutorialPointer = ({ step }) => {
    if (step === null || step === undefined) return null;

    return (
        <div className="tutorial-pointer" />
    );
};

export default TutorialPointer;
