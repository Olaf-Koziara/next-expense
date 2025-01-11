import React, {createContext, useContext, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {Wallet} from '@/types/Wallet';

type WalletContextType = {
    wallets: Wallet[];
    selectedWallet: Wallet | null;
    setSelectedWallet: (wallet: Wallet) => void;
    addWallet: (wallet: { name: string }) => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({children}: { children: React.ReactNode }) => {
    const {data: session} = useSession();
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

    useEffect(() => {
        if (session) {
            fetch(`/api/wallet`, {method: 'GET'})
                .then(result => {
                    if (result) return result.json()
                })
                .then(data => {
                    setWallets(data);
                    setSelectedWallet(data[0] || null);
                });
        }
    }, [session]);

    const addWallet = async (wallet: { name: string }) => {
        if (!session) return;

        const response = await fetch(`/api/wallet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wallet),
        });

        if (response.ok) {
            const newWallet = await response.json();
            setWallets(prevWallets => [...prevWallets, newWallet]);
        }
    };

    return (
        <WalletContext.Provider value={{wallets, selectedWallet, setSelectedWallet, addWallet}}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};