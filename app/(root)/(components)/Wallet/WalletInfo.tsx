import React from "react";
import {useWallet} from "@/context/WalletContext";

const WalletInfo = () => {
    const {selectedWallet} = useWallet();


    return (
        selectedWallet ?
            <div>
                <p className='text-center'>{selectedWallet.name}</p>
            </div> : null
    );
};

export default WalletInfo;