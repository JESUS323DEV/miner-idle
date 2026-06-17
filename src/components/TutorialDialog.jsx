import "../styles/tutorial.css";

const STEPS = {
    intro: {
        title: "¡Bienvenido a Lady Hungry!",
        text: "Comienza tu aventura minera. Consigue oro, extrae materiales, mejora tu equipo y recluta poderosas mascotas que trabajarán a tu lado para aumentar tu producción.",
        subtext: "Lady Hungry se encuentra actualmente en desarrollo, por lo que algunas funciones pueden cambiar y es posible que encuentres algún error durante tu aventura. ¡Gracias por probar el juego!",
        action: "¡Empezar!",
        counter: null,
        showSkip: true,
    },
    0: {
        title: "Ingresos pasivos",
        text: "Cada segundo puedes ganar oro automáticamente. Compra tu primera mejora y comienza a generar oro.",
        action: null,
        counter: "Paso 1 de 4",
        showSkip: true,
    },
    1: {
        title: "Tu energía",
        text: "La cantidad de Energía determina cuánto tiempo puedes mantener activa tu habilidad. Auméntala para prolongar su duración y aprovechar el bonus de materiales durante más tiempo.",
        action: null,
        counter: "Paso 2 de 4",
        showSkip: true,
    },
    2: {
        title: "Tu pico",
        text: "El pico es tu herramienta principal. Mejóralo para extraer más materiales y avanzar más rápido en tu aventura.",
        action: null,
        counter: "Paso 3 de 4",
        showSkip: true,
    },
    hint_tavern: {
        title: "La Taberna",
        text: "La taberna es el lugar donde contratar nuevas mascotas mineras, intercambiar materiales por monedas y conseguir recursos.",
        action: "Entendido",
        counter: "Paso 4 de 6",
        showSkip: true,
    },
    hint_mine: {
        title: "Las Minas",
        text: "En las minas consigues materiales para mejorar tu equipo. También podrás desbloquear minas pasivas donde tus mascotas trabajarán por ti. Explóralas.",
        action: "Entendido",
        counter: "Paso 5 de 6",
        showSkip: true,
    },
    hint_forge: {
        title: "La Forja",
        text: "Funde minerales en valiosos lingotes para mejorar tu pico y tus herramientas. También podrás asignar mascotas a las forjas para aumentar la velocidad de producción.",
        action: "Entendido",
        counter: "Paso 6 de 6",
        showSkip: true,
    },
    mine_tap: {
        title: "¡A picar!",
        text: "Toca la mena para golpear y conseguir oro.",
        action: null,
        counter: null,
        showSkip: false,
    },
    repair_hint: {
        title: "¡Pico roto!",
        text: "Tu pico se ha roto. Toca el icono de reparar para recuperar su durabilidad.",
        action: null,
        counter: null,
        showSkip: false,
    },
    stamina_hint: {
        title: "¡Activa tu Energía!",
        text: "Toca el icono de energía para activar el burst. Mientras dure, cada golpe te da materiales extra. Se recarga automáticamente.",
        action: null,
        counter: null,
        showSkip: false,
    },
    hint_rewards: {
        title: "Tus primeras recompensas",
        text: "Tienes recompensas disponibles. Ábrelas, reclámalas todas y cierra el panel cuando termines.",
        action: null,
        counter: null,
        showSkip: false,
    },
    hint_rental: {
        title: "Alquiler de ayudantes",
        text: "Puedes alquilar ayudantes temporales. Alquila a Zeus para el slot de oro y a Druh para raids. ¡Son gratis ahora!",
        action: null,
        counter: null,
        showSkip: false,
    },
    hint_raids: {
        title: "¡Envía una raid!",
        text: "Selecciona el Bosque Antiguo, añade a Druh al equipo y envíalo. Vuelve cuando regrese para recoger las recompensas.",
        action: null,
        counter: null,
        showSkip: false,
    },
    hint_mine_dog: {
        title: "Zeus está activo",
        text: "Zeus te da una bonificación pasiva cada vez que picas. Mientras esté alquilado trabajará para ti. Consigue sus fragmentos para quedártelo para siempre. Puedes llevar hasta 3 ayudantes equipados al mismo tiempo.",
        action: "Entendido",
        counter: null,
        showSkip: false,
    },
    done: {
        title: "¡COMIENZA LA AVENTURA!",
        text: "Sigue explorando minas, mejora tu equipo, refuerza tu forja y visita la taberna para contratar ayudantes. Tu aventura acaba de comenzar.",
        action: "¡A minar!",
        counter: null,
        showSkip: false,
    },
};

const TutorialDialog = ({ step, onSkip, onAction, isFirstTime = true, dialogStyle = {} }) => {
    if (step === null || step === undefined) return null;
    const data = STEPS[step];
    if (!data) return null;

    return (
        <div className="tutorial-dialog" style={dialogStyle}>
            {data.counter && (
                <span className="tutorial-dialog-counter">{data.counter}</span>
            )}
            <h3 className="tutorial-dialog-title">{data.title}</h3>
            <p className="tutorial-dialog-text">{data.text}</p>
            {data.subtext && (
                <p className="tutorial-dialog-subtext">{data.subtext}</p>
            )}
            {data.action && (
                <button className="tutorial-dialog-btn" onClick={onAction}>
                    {data.action}
                </button>
            )}
        </div>
    );
};

export default TutorialDialog;
