'use client';

import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function ToasterProvider() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return <Toaster position="top-right" />;
}
