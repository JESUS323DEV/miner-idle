// Preloader.jsx
import { useEffect } from 'react';

// Importas todos los fondos aquí

//tavern
import bgTavern from "../assets/backgrounds/bg-tavern/bg-tavern1.png"
import bgCoin from "../assets/backgrounds/bg-tavern/bg-coin.png"
import bgGold1 from "../assets/backgrounds/bg-tavern/bg-gold.png"

//mine
import bgMineBronze from "../assets/backgrounds/bg-mines/bg-mine-bronze.png"
import bgMineIron from "../assets/backgrounds/bg-mines/bg-mine-iron.png"
import bgMineDiamond from "../assets/backgrounds/bg-mines/bg-mine-diamond.png"

import bgMain from "../assets/backgrounds/fondo4.png";
import bgGold from "../assets/backgrounds/bg-modals-hud/fondoGold.png";
import bgStamina from "../assets/backgrounds/bg-modals-hud/bgStamina.png";
import bgPickaxe from "../assets/backgrounds/bg-modals-hud/fondoWorkShop.png";





// ... todos los demás fondos

const IMAGES = [
    bgTavern, bgGold, bgCoin, bgGold1,
    bgMineBronze, bgMineIron, bgMineDiamond, bgMain, bgStamina, bgPickaxe,
];

const Preloader = () => {
    useEffect(() => {
        IMAGES.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    return null; // no renderiza nada
};

export default Preloader;