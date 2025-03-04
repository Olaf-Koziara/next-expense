import {Wallet} from "@/types/Wallet";
import {useSession} from "next-auth/react";
import {createContext, useContext, useEffect, useRef, useState} from "react";
import {walletsService} from "@/app/services/wallets";
import {expensesService} from "@/app/services/expenses";
import {incomesService} from "@/app/services/incomes";
import {WalletStats} from "@/types/Stats";
import {statisticsService} from "@/app/services/statistics";
import {QueryParams} from "@/app/services/api";
import {Expense} from "@/types/Expense";
import {useEvent} from "@/hooks/useEvenet";
import {ResponseWithArray} from "@/types/Service";
import {Income} from "@/types/Income";

type WalletContextType = {
    wallets: Wallet[];
    selectedWallet: Wallet | null;
    setSelectedWallet: (wallet: Wallet) => void;
    addWallet: (wallet: { name: string }) => Promise<void>;
    addExpense: (expense: Expense) => Promise<void>;
    getExpenses: (params?: QueryParams) => Promise<ResponseWithArray<Expense>>;
    getIncomes: (params?: QueryParams) => Promise<ResponseWithArray<Income>>;
    addIncome: (expense: Expense) => Promise<void>;
    removeExpense: (_id: string) => Promise<void>;
    removeIncome: (_id: string) => Promise<void>;
    getStatistics: (params?: QueryParams) => Promise<WalletStats>;
};
const WalletContext = createContext<WalletContextType | undefined>(undefined);


export const WalletProvider = ({children}: { children: React.ReactNode }) => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWalletState] = useState<Wallet | null>(null);
    const selectedWalletRef = useRef<Wallet | null>(null);
    const {dispatch} = useEvent('walletChange', (wallet: Wallet) => {
        setSelectedWallet(wallet, false)
    });
    useEffect(() => {
        selectedWalletRef.current = selectedWallet;
    }, [selectedWallet]);
    useEffect(() => {

        walletsService.getAll().then((data) => {
            setWallets(data);
            const storedWallet = JSON.parse(localStorage.getItem("selectedWallet") ?? '{}') as Wallet;
            if (storedWallet) {
                const wallet = data.find((wallet) => wallet._id === storedWallet._id);
                if (wallet) {
                    setSelectedWallet(wallet, true);
                } else {
                    setSelectedWallet(data[0] || null);
                }
            }


        });
    }, []);
    const setSelectedWallet = (wallet: Wallet, dispatchEvent = true) => {
        setSelectedWalletState(wallet);
        storeSelectedWallet(wallet);
        if (dispatchEvent) {
            dispatch(wallet)
        }

    }
    const storeSelectedWallet = (wallet: Wallet) => {
        localStorage.setItem("selectedWallet", JSON.stringify(wallet));
    }

    const addWallet = async (wallet: { name: string }) => {
        const newWallet = await walletsService.add(wallet);
        setWallets((prevWallets) => [...prevWallets, newWallet]);
    };

    const withWalletAndData = <T, K>(
        action: (data: T, walletId: string) => Promise<K>
    ) => {
        return (data: T) => {
            const currentWallet = selectedWalletRef.current;
            if (!currentWallet) {
                alert("No wallet selected");
                return Promise.reject({message: "No wallet selected"});
            }
            return action(data, currentWallet._id);
        };
    };

    const withWallet = <K, P extends any[]>(
        action: (walletId: string, ...args: P) => Promise<K>
    ) => {
        return (...args: P) => {
            const currentWallet = selectedWalletRef.current;
            if (!currentWallet) {
                return Promise.reject({message: "No wallet selected"});
            }
            return action(currentWallet._id, ...args);
        };
    };

    const addIncome = withWalletAndData(incomesService.add);
    const addExpense = withWalletAndData(expensesService.add);
    const removeIncome = withWalletAndData(incomesService.remove);
    const getStatistics = withWallet((walletId: string, params: QueryParams = {}) => statisticsService.getAll(walletId, params));
    const getExpenses = withWallet((walletId: string, params: QueryParams = {}) => expensesService.getAll(params, walletId));
    const getIncomes = withWallet(incomesService.getAll);
    const removeExpense = withWalletAndData(expensesService.remove);

    return (
        <WalletContext.Provider
            value={{
                wallets,
                selectedWallet,
                setSelectedWallet,
                addWallet,
                addExpense,
                removeExpense,
                addIncome,
                getIncomes,
                removeIncome,
                getStatistics,
                getExpenses,

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