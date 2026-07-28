import { useEffect, useRef, useState } from 'react';

/**
 * Notifica (pulso) solo cuando canAfford pasa de false a true.
 * markSeen() apaga el aviso aunque canAfford siga en true.
 */
export const useAffordNotify = (canAfford) => {
    const [unseen, setUnseen] = useState(canAfford);
    const prevRef = useRef(canAfford);

    useEffect(() => {
        if (canAfford && !prevRef.current) setUnseen(true);
        else if (!canAfford) setUnseen(false);
        prevRef.current = canAfford;
    }, [canAfford]);

    const markSeen = () => setUnseen(false);

    return [unseen, markSeen];
};

export default useAffordNotify;
