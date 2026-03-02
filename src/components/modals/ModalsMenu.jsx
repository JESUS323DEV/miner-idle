import { X, } from "lucide-react"

import "../../styles/modals/ModalsMenu.css"


const ModalsMenu = ({

    // ===== PROPS BÁSICAS (usadas por todos los modales) =====

    isOpen, // Boolean: Si el modal está abierto
    onClose,             // Function: Cierra el modal
    title,               // String: Título del modal 
    subTitle,           // String: Sub Título del modal 
    button1,
    textButton,

}) => {

    if (!isOpen) return null;
    return (

        <div className="cont-modal">
            <div className="container-modal">
                <button onClick={onClose}>
                    <X />
                </button>



                <div>
                    {/* TÍTULO DEL MODAL */}
                    <h2>{title}</h2>
                    <h5>{subTitle}</h5>
                </div>

                <div>
                    <button onClick={button1}>{textButton}</button>


                </div>

            </div>

        </div>
    );
}

export default ModalsMenu;