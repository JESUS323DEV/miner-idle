import { formatNumber, formatNumber2 } from '../game/utils/formatters.js';
import coinTavern from '../assets/ui/icons-hud/hud-principal/coin-tavern1.webp';
import huesinCoin from '../assets/ui/icons-hud/hud-principal/huesin-coin.webp';
import '../styles/components/CurrencyHud.css';

/**
 * Barra de monedas (coin taberna, huesin) para el acceso standalone de Lady Run,
 * que no tiene el HUD grande de Pata y Pico. Sin oro: en este acceso no se gana ni se usa.
 */
const CurrencyHud = ({ tavernCoins = 0, huesin = 0 }) => (
    <div className="currency-hud">
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
