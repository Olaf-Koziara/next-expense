'use client';
import React, {useEffect} from 'react';
import {useWallet} from "@/context/WalletContext";
import {Income} from "@/types/Income";

const Page = () => {
    const {wallets, selectedWallet, setSelectedWallet} = useWallet();
    const [data, setData] = React.useState<Income[]>([])
    useEffect(() => {
        if (selectedWallet) {
            fetch(`/api/expense?wallet=${selectedWallet?._id}`).then(res => res.json().then(data => setData(data))).catch(error => console.error(error))
        }
    }, [selectedWallet])
    return (
        <div>

        </div>
    );
};

export default Page;