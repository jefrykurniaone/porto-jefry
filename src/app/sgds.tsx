'use client';

import { useEffect } from 'react';

export default function SgdsLibraryLoader() {
    useEffect(() => {
        void import('@govtechsg/sgds-web-component').catch((error) => {
            // eslint-disable-next-line no-console
            console.error('[SGDS] failed to load web components:', error);
        });
    }, []);

    return null;
}
