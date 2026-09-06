import { ArrowLeft } from 'lucide-react';
import chapaIcon from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/chapas.webp';
import tavernCoinIcon from '../../assets/ui/icons-hud/hud-principal/coin-tavern1.webp';
import redHeartIcon from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-dog/vida-base-2.webp';
import magicHeartIcon from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-dog/corazon-magico.webp';
import greenHeartIcon from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/icons-life/life-dog/life-green.webp';
import '../../styles/modals/LadyRunShopModal.css';

// Tienda propia de Lady Run, separada de la de Pata y Pico para no tocar sus precios/economia.
// "Tienda" es nombre momentaneo.
// - corazon_extra: se gasta al momento, suma una vida inicial a la siguiente run (ladyRunPendingHearts).
// - corazon_magico: se guarda en inventario (tope 2, ladyRunMagicHearts), da 5s de invulnerabilidad
//   al usarlo en Modo Libre, se mantiene entre partidas si no se usa.
// - corazon_verde: se guarda en inventario (tope 5, ladyRunGreenHearts), solo Modo Libre. Al empezar
//   la run se activan todos como escudo extra: cada golpe consume 1 en vez de vida real, y se pierden
//   de verdad al gastarse (no vuelven). Si sobran al terminar la run, se quedan para la siguiente.
const HEART_ITEM = { id: 'corazon_extra', name: 'Corazón extra', desc: 'Una vida más al empezar', price: 50 };
const MAGIC_HEART_ITEM = { id: 'corazon_magico', name: 'Corazón mágico', desc: '5s de invulnerabilidad', price: 100 };
const MAGIC_HEART_MAX = 2;
const GREEN_HEART_ITEM = { id: 'corazon_verde', name: 'Corazón verde', desc: 'Absorbe 1 golpe sin perder vida', price: 150 };
const GREEN_HEART_MAX = 5;

export default function LadyRunShopModal({ onClose, chapas = 0, tavernCoins = 0, magicHearts = 0, greenHearts = 0, onBuyItem }) {
    const canAffordHeart = chapas >= HEART_ITEM.price;
    const magicHeartAtMax = magicHearts >= MAGIC_HEART_MAX;
    const canAffordMagicHeart = !magicHeartAtMax && tavernCoins >= MAGIC_HEART_ITEM.price;
    const greenHeartAtMax = greenHearts >= GREEN_HEART_MAX;
    const canAffordGreenHeart = !greenHeartAtMax && chapas >= GREEN_HEART_ITEM.price;

    return (
        <div className="lady-run-shop-backdrop" onClick={onClose}>
            <div className="lady-run-shop-panel" onClick={e => e.stopPropagation()}>
                <button className="lady-run-back-btn" onClick={onClose}><ArrowLeft size={16} /></button>
                <p className="runner-overlay-title">Tienda</p>

                <div className="lady-run-shop-content">
                    <div className="lady-run-shop-heart-card">
                        <img src={redHeartIcon} alt="" className="lady-run-shop-heart-card-icon" />
                        <span className="lady-run-shop-heart-card-name">{HEART_ITEM.name}</span>
                        <span className="lady-run-shop-heart-card-desc">{HEART_ITEM.desc}</span>
                        <button
                            className="runner-start-btn runner-start-btn-compact"
                            disabled={!canAffordHeart}
                            onClick={() => onBuyItem?.(HEART_ITEM.id, HEART_ITEM.price)}
                        >
                            <img src={chapaIcon} alt="Chapas" className="lady-run-shop-heart-card-buy-icon" />
                            {HEART_ITEM.price}
                        </button>
                    </div>

                    <div className="lady-run-shop-heart-card">
                        <img src={magicHeartIcon} alt="" className="lady-run-shop-heart-card-icon" />
                        <span className="lady-run-shop-heart-card-name">{MAGIC_HEART_ITEM.name}</span>
                        <span className="lady-run-shop-heart-card-desc">{MAGIC_HEART_ITEM.desc}</span>
                        <button
                            className="runner-start-btn runner-start-btn-compact"
                            disabled={!canAffordMagicHeart}
                            onClick={() => onBuyItem?.(MAGIC_HEART_ITEM.id, MAGIC_HEART_ITEM.price)}
                        >
                            {magicHeartAtMax ? 'Máx. 2' : (
                                <>
                                    <img src={tavernCoinIcon} alt="Monedas" className="lady-run-shop-heart-card-buy-icon" />
                                    {MAGIC_HEART_ITEM.price}
                                </>
                            )}
                        </button>
                    </div>

                    <div className="lady-run-shop-heart-card">
                        <img src={greenHeartIcon} alt="" className="lady-run-shop-heart-card-icon" />
                        <span className="lady-run-shop-heart-card-name">{GREEN_HEART_ITEM.name}</span>
                        <span className="lady-run-shop-heart-card-desc">{GREEN_HEART_ITEM.desc}</span>
                        <button
                            className="runner-start-btn runner-start-btn-compact"
                            disabled={!canAffordGreenHeart}
                            onClick={() => onBuyItem?.(GREEN_HEART_ITEM.id, GREEN_HEART_ITEM.price)}
                        >
                            {greenHeartAtMax ? 'Máx. 5' : (
                                <>
                                    <img src={chapaIcon} alt="Chapas" className="lady-run-shop-heart-card-buy-icon" />
                                    {GREEN_HEART_ITEM.price}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Idea a futuro, sin funcionalidad todavia - sin icono. */}
                    <div className="lady-run-shop-heart-card">
                        <span className="lady-run-shop-heart-card-name">Bomba</span>
                        <span className="lady-run-shop-heart-card-desc">Placeholder</span>
                        <button className="runner-start-btn runner-start-btn-compact lady-run-shop-soon-btn" disabled>
                            Próx.
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
