'use client';

import {  memo } from "react";
import WalletList from "./WalletList";



const WalletListWrapper = memo(() => {
    return (
            <WalletList />
    );
});

WalletListWrapper.displayName = 'WalletListWrapper';

export default WalletListWrapper;
