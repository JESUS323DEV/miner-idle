import { formatNumber, formatNumber2 } from '../game/utils/formatters.js';
import iconGold from '../assets/ui/icons-hud/hud-principal/oro1.webp';
import coinTavern from '../assets/ui/icons-hud/hud-principal/coin-tavern1.webp';
import huesinCoin from '../assets/ui/icons-hud/hud-principal/huesin-coin.webp';
import '../styles/components/CurrencyHud.css';

/**
 * Barra de las 3 monedas (oro, coin taberna, huesin), sin materiales.
 * Pensada para el acceso standalone de Lady Run, que no tiene el HUD grande de Pata y Pico.
 */
const CurrencyHud = ({ gold = 0, tavernCoins = 0, huesin = 0 }) => (
    <div className="currency-hud">
        <div className="currency-hud-item">
            <img src={iconGold} alt="Oro" />
            <span>{formatNumber2(gold)}</span>
        </div>
        <div className="currency-hud-item">
            <img src={coinTavern} alt="Coin taberna" />
            <span>{formatNumber2(tavernCoins)}</span>
        </div>
        <div className="currency-hud-item">
            <img src={huesinCoin} alt="Huesín" />
            <span>{formatNumber(huesin)}</span>
        </div>
    </div>
);

export default CurrencyHud;
