import { useState, useCallback } from 'react';

export const useFloatingNumbers = () => {
    const [floats, setFloats] = useState([]);

    const add = useCallback((type, data = {}, duration = 1000) => {
        const id = `${Date.now()}-${Math.random()}`;
        setFloats(prev => [...prev, { id, type, ...data }]);
        setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), duration);
    }, []);

    return { floats, add };
};
