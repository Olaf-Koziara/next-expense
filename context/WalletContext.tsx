import React, {createContext, useContext, useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {Wallet} from "@/types/Wallet";
import {api} from "@/app/services/api";
import {walletsService} from "@/app/services/wallets";
import {Expense} from "@/types/Expense";
import {expensesService} from "@/app/services/expenses";
import {Income} from "@/types/Income";
import {incomesService} from "@/app/services/incomes";

type WalletContextType = {
    wallets: Wallet[];
    selectedWallet: Wallet | null;
    setSelectedWallet: (wallet: Wallet) => void;
    addWallet: (wallet: { name: string }) => Promise<void>;
    addExpense: (expense: Expense) => Promise<void>;
    addIncome: (expense: Expense) => Promise<void>;
    deleteExpense: (_id: string) => Promise<void>;
    deleteIncome: (_id: string) => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);
const withWalletCheck = <T, >(
    selectedWallet: Wallet | null,
    action: (walletId: string, data: T) => Promise<any>
) => {
    return (data: T) => {
        if (!selectedWallet) return Promise.reject(new Error("No wallet selected"));
        return action(selectedWallet._id, data)
    }
};
export const WalletProvider = ({children}: { children: React.ReactNode }) => {
    const {data: session} = useSession();
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

    useEffect(() => {
        if (!session) return;

        walletsService.getAll().then((data) => {
            setWallets(data);
            setSelectedWallet(data[0] || null);
        });
    }, [session]);

    const addWallet = async (wallet: { name: string }) => {
        if (!session) return;
        const newWallet = await walletsService.add(wallet);
        setWallets((prevWallets) => [...prevWallets, newWallet]);
    };
    const addExpense = withWalletCheck(selectedWallet, expensesService.add)
    const addIncome = withWalletCheck(selectedWallet, incomesService.add)
    const deleteExpense = withWalletCheck(selectedWallet, expensesService.deleteOne)
    const deleteIncome = withWalletCheck(selectedWallet, incomesService.deleteOne)

    return (
        <WalletContext.Provider
            value={{
                wallets,
                selectedWallet,
                setSelectedWallet,
                addWallet,
                addExpense,
                deleteExpense,
                addIncome,
                deleteIncome
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};
