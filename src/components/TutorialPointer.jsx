import "../styles/tutorial.css"
import { ChevronsDown } from "lucide-react"

const TutorialPointer = ({ step }) => {
    if (step === null) return null;

    const texts = {
        0: "Mejorar oro",
        1: "Mejorar stamina",
        2: "Mejorar pico"
    };

    if (texts[step] === undefined) return null;

    return (
        <div className="tutorial-pointer">
            <div className="tutorial-arrow"><ChevronsDown /></div>
            <div className="tutorial-text">{texts[step]}</div>
        </div>
    );
};

export default TutorialPointer;