'use client';

import dynamic from 'next/dynamic';
import {Suspense} from "react";

const WalletList = dynamic(() => import('@/components/WalletList/WalletList'), {ssr: false});

const WalletListWrapper = () => {
    return (
        <Suspense fallback={<div>Loading Wallets...</div>}>
            <WalletList/>
        </Suspense>
    )
};

export default WalletListWrapper;
