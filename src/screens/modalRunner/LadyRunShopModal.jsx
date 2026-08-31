import { useState } from 'react';
import { Heart, Shield } from 'lucide-react';
import chapaIcon from '../../assets/ui/icons-hud/hud-modals/game-run/icons/hud/chapas.webp';
import '../../styles/modals/LadyRunShopModal.css';

// Tienda propia de Lady Run, separada de la de Pata y Pico para no tocar sus precios/economia.
// "Tienda" es nombre momentaneo. Objetos: solo etiquetas de momento, sin logica de compra/uso todavia.
const SHOP_ITEMS = [
    { id: 'corazon_extra', name: 'Corazón extra', desc: 'Una vida más al empezar', Icon: Heart, price: 50, buyable: true },
    { id: 'escudo', name: 'Escudo', desc: 'Protege de hasta 2 fallos', Icon: Shield, price: 80, buyable: false },
];

export default function LadyRunShopModal({ onClose, chapas = 0, onBuyItem }) {
    const [tab, setTab] = useState('skins');

    return (
        <div className="lady-run-shop-backdrop" onClick={onClose}>
            <div className="lady-run-shop-panel" onClick={e => e.stopPropagation()}>
                <p className="runner-overlay-title">Tienda</p>

                <div className="lady-run-shop-tabs">
                    <button
                        className={`lady-run-shop-tab-btn${tab === 'skins' ? ' lady-run-shop-tab-active' : ''}`}
                        onClick={() => setTab('skins')}
                    >Skins</button>
                    <button
                        className={`lady-run-shop-tab-btn${tab === 'objetos' ? ' lady-run-shop-tab-active' : ''}`}
                        onClick={() => setTab('objetos')}
                    >Objetos</button>
                </div>

                <div className="lady-run-shop-content">
                    {tab === 'skins' && <p className="lady-run-shop-empty">Próximamente</p>}
                    {tab === 'objetos' && (
                        <div className="lady-run-shop-items">
                            {SHOP_ITEMS.map(item => {
                                const canAfford = chapas >= item.price;
                                return (
                                    <div key={item.id} className="lady-run-shop-item">
                                        <item.Icon size={22} className="lady-run-shop-item-icon" />
                                        <div className="lady-run-shop-item-info">
                                            <span className="lady-run-shop-item-name">{item.name}</span>
                                            <span className="lady-run-shop-item-desc">{item.desc}</span>
                                        </div>
                                        {item.buyable ? (
                                            <button
                                                className="lady-run-shop-buy-btn"
                                                disabled={!canAfford}
                                                onClick={() => onBuyItem?.(item.id, item.price)}
                                            >
                                                <img src={chapaIcon} alt="Chapas" />
                                                <span>{item.price}</span>
                                            </button>
                                        ) : (
                                            <div className="lady-run-shop-item-price">
                                                <img src={chapaIcon} alt="Chapas" />
                                                <span>{item.price}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <button className="runner-start-btn runner-start-btn-compact" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}
