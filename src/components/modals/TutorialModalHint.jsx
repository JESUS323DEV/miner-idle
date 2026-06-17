const MODAL_HINTS = {
    goldPerSecond: {
        text: "El oro por segundo es el motor del juego. Cuanto más lo mejores, más rico serás sin hacer nada.",
        style: {
            top: '22rem',
            left: '5%',
            width: '90%',
        },
    },
    goldPerSecondSnacks: {
        text: "Las galletas dan un boost de oro por segundo durante un tiempo. Desbloquéalas con monedas de taberna cuando puedas.",
        buttonLabel: "Entendido",
        style: {
            top: '6rem',
            left: '5%',
            width: '90%',
        },
    },
    stamina: {
        text: "Mejora la Energía para aumentar la duración del burst, reducir su tiempo de recarga y obtener más materiales mientras esté activo.",
        style: {
            top: '6rem',
            left: '5%',
            width: '90%',
        },
    },
    pickaxe: {
        text: "Refuerza tu pico para conseguir más materiales. Cuando alcance el nivel máximo, podrás ascenderlo al siguiente nivel para obtener una mayor durabilidad.",
        style: {
            top: '6rem',
            left: '5%',
            width: '90%',
        },
    },
};

const TutorialModalHint = ({ hint, onAction }) => {
    const data = MODAL_HINTS[hint];
    if (!data) return null;

    return (
        <div className="tutorial-modal-hint" style={data.style}>
            <p className="tutorial-modal-hint-text">{data.text}</p>
            {data.buttonLabel && (
                <button className="tutorial-modal-hint-btn" onClick={onAction}>
                    {data.buttonLabel}
                </button>
            )}
        </div>
    );
};

export default TutorialModalHint;
