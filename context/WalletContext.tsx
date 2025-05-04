import {Wallet} from "@/types/Wallet";
import {createContext, useContext, useEffect, useRef, useState, useCallback} from "react";
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
    setSelectedWallet: (wallet: Wallet | null) => void;
    addWallet: (wallet: Omit<Wallet, '_id'|'balance'>) => Promise<void>;
    addExpense: (expense: Expense) => Promise<void>;
    getExpenses: (params?: QueryParams) => Promise<ResponseWithArray<Expense>>;
    getIncomes: (params?: QueryParams) => Promise<ResponseWithArray<Income>>;
    addIncome: (expense: Expense) => Promise<void>;
    removeExpense: (_id: string) => Promise<void>;
    removeIncome: (_id: string) => Promise<void>;
    getStatistics: (params?: QueryParams) => Promise<WalletStats>;
    removeWallet: (walletId: string) => Promise<void>;
    updateWallet: (walletId: string, data: Partial<Wallet>) => Promise<void>;
};

const defaultContext: WalletContextType = {
    wallets: [],
    selectedWallet: null,
    setSelectedWallet: () => {},
    addWallet: async () => {},
    removeWallet: async () => {},
    updateWallet: async () => {},
    addExpense: async () => {},
    getExpenses: async () => ({ data: [], totalCount: 0, total: 0 }),
    getIncomes: async () => ({ data: [], totalCount: 0, total: 0 }),
    addIncome: async () => {},
    removeExpense: async () => {},
    removeIncome: async () => {},
    getStatistics: async () => ({
        highestExpenseCategory: { category: '', total: 0 },
        highestIncomeCategory: { category: '', total: 0 },
        summedExpenseCategories: [],
        summedIncomeCategories: [],
        summedExpenseCategoriesAndDate: [],
        summedIncomeCategoriesAndDate: []
    })
};

const WalletContext = createContext<WalletContextType>(defaultContext);

export const WalletProvider = ({children}: { children: React.ReactNode }) => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWalletState] = useState<Wallet | null>(null);
    const selectedWalletRef = useRef<Wallet | null>(null);

    const {dispatch} = useEvent('walletChange', (wallet: Wallet) => {
        setSelectedWalletState(wallet);
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
                    setSelectedWalletState(wallet);
                } else {
                    setSelectedWalletState(data[0] || null);
                }
            }
        });
    }, []);

    const setSelectedWallet = useCallback((wallet: Wallet | null) => {
        setSelectedWalletState(wallet);
        if (wallet) {
            localStorage.setItem("selectedWallet", JSON.stringify(wallet));
        } else {
            localStorage.removeItem("selectedWallet");
        }
    }, []);

    const addWallet = useCallback(async (wallet: Omit<Wallet, '_id'|'balance'>) => {
        const newWallet = await walletsService.add(wallet);
        setWallets(prevWallets => [...prevWallets, newWallet] as Wallet[]);
    }, []);

    const removeWallet = useCallback(async (walletId: string) => {
        await walletsService.remove(walletId);
        setWallets((prevWallets) => prevWallets.filter(wallet => wallet._id !== walletId));
        if (selectedWallet?._id === walletId) {
            setSelectedWalletState(null);
        }
    }, [selectedWallet]);

    const updateWallet = useCallback(async (walletId: string, data: Partial<Wallet>) => {
        const updatedWallet = await walletsService.patch(walletId, data);
        setWallets((prevWallets) => prevWallets.map(wallet => 
            wallet._id === walletId ? updatedWallet : wallet
        ));
        if (selectedWallet?._id === walletId) {
            setSelectedWalletState(updatedWallet);
        }
    }, [selectedWallet]);

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
                removeWallet,
                updateWallet,
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