import { useEffect } from 'react';
import { playSfx } from '../game/utils/sfx.js';
import '../styles/PrizeOverlay.css';

/**
 * Overlay de premio reutilizable.
 *
 * Props:
 *   prizeData  — { icon, label, sublabel?, isWin, sfx }  |  null (oculto)
 *   onAccept   — callback al cerrar
 */
export default function PrizeOverlay({ prizeData, onAccept }) {
    useEffect(() => {
        if (prizeData?.sfx) playSfx(prizeData.sfx);
    }, [prizeData]);

    if (!prizeData) return null;

    return (
        <div className="prize-overlay" onClick={onAccept}>
            <div className="prize-card" onClick={e => e.stopPropagation()}>
                <img
                    src={prizeData.icon}
                    className={`prize-icon-anim ${prizeData.isWin ? '' : 'prize-icon-lose'}`}
                    alt=""
                />
                <p className={`prize-main-label ${prizeData.isWin ? 'prize-label-win' : 'prize-label-lose'}`}>
                    {prizeData.label}
                </p>
                {prizeData.sublabel && (
                    <p className="prize-sub-label">{prizeData.sublabel}</p>
                )}
                <button className="prize-accept-btn" onClick={onAccept}>
                    Aceptar
                </button>
            </div>
        </div>
    );
}
