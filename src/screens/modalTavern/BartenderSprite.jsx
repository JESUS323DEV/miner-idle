import { useState, useEffect } from 'react';
import pose1 from '../../assets/ui/icons-hud/hud-modals/cantinero-assets/icon-1.webp';
import pose2 from '../../assets/ui/icons-hud/hud-modals/cantinero-assets/icon-2.webp';
import pose3 from '../../assets/ui/icons-hud/hud-modals/cantinero-assets/icon-3.webp';
import poseMax from '../../assets/ui/icons-hud/hud-modals/cantinero-assets/icon-max.webp';

const IDLE_POSES = [pose1, pose2, pose3];
const CYCLE_MS = 2500;
const FADE_MS = 300;

export default function BartenderSprite({ isMax }) {
    const [idx, setIdx] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (isMax) return;
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIdx(i => (i + 1) % IDLE_POSES.length);
                setVisible(true);
            }, FADE_MS);
        }, CYCLE_MS);
        return () => clearInterval(interval);
    }, [isMax]);

    return (
        <img
            src={isMax ? poseMax : IDLE_POSES[idx]}
            className="bartender-sprite"
            style={{ opacity: visible ? 1 : 0 }}
            alt=""
        />
    );
}
