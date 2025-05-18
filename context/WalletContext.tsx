'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Wallet } from '@/types/Wallet';
import { walletsService } from '@/app/services/wallets';
import { expensesService } from "@/app/services/expenses";
import { incomesService } from "@/app/services/incomes";
import { Expense } from "@/types/Expense";
import { Income } from "@/types/Income";
import { ResponseWithArray } from "@/types/Service";

interface WalletContextType {
    wallets: Wallet[];
    selectedWallet: Wallet | null;
    isLoading: boolean;
    error: string | null;
    transactionType: 'expense' | 'income';
    setTransactionType: (type: 'expense' | 'income') => void;
    setSelectedWallet: (wallet: Wallet | null) => void;
    refreshWallets: () => Promise<void>;
    createWallet: (wallet: Omit<Wallet, '_id'>) => Promise<void>;
    updateWallet: (wallet: Wallet) => Promise<void>;
    deleteWallet: (walletId: string) => Promise<void>;
    addExpense: (expense: Expense) => Promise<void>;
    getExpenses: (params?: any) => Promise<ResponseWithArray<Expense>>;
    getIncomes: (params?: any) => Promise<ResponseWithArray<Income>>;
    addIncome: (expense: Expense) => Promise<void>;
    removeExpense: (_id: string) => Promise<void>;
    removeIncome: (_id: string) => Promise<void>;
    transactions: (Expense | Income)[];
    setTransactions: React.Dispatch<React.SetStateAction<Expense|Income[]>>;
    refetchTrigger: number;
    triggerRefetch: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
    const [transactions, setTransactions] = useState<(Expense | Income)[]>([]);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const triggerRefetch = () => {
        setRefetchTrigger(prev => prev + 1);
    };

    const fetchWallets = async () => {
        try {
            setIsLoading(true);
            const response = await walletsService.getAll();
            setWallets(response);
            setSelectedWallet(response[0]);
            setError(null);
        } catch (err) {
            setError('Failed to fetch wallets');
            console.error('Error fetching wallets:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets()

    }, []);
 
    const createWallet = async (wallet: Omit<Wallet, '_id'>) => {
        try {
            const newWallet = await walletsService.add(wallet);
            setWallets(prev => [...prev, newWallet]);
            setError(null);
        } catch (err) {
            setError('Failed to create wallet');
            console.error('Error creating wallet:', err);
        }
    };

    const updateWallet = async (wallet: Wallet) => {
        try {
            await walletsService.patch(wallet._id, wallet);
            setWallets(prev => prev.map(w => w._id === wallet._id ? wallet : w));
            if (selectedWallet?._id === wallet._id) {
                setSelectedWallet(wallet);
            }
            setError(null);
        } catch (err) {
            setError('Failed to update wallet');
            console.error('Error updating wallet:', err);
        }
    };

    const deleteWallet = async (walletId: string) => {
        try {
            await walletsService.remove(walletId);
            setWallets(prev => prev.filter(w => w._id !== walletId));
            if (selectedWallet?._id === walletId) {
                setSelectedWallet(null);
            }
            setError(null);
        } catch (err) {
            setError('Failed to delete wallet');
            console.error('Error deleting wallet:', err);
        }
    };
    const fetchTransactions = async (params?:Record<string,any>) => {
        let response:ResponseWithArray<Expense | Income>;
        if(params){
            response = transactionType === 'expense' ? await expensesService.getAll(params,selectedWallet?._id) : await incomesService.getAll(params,selectedWallet?._id);
        }else{
            response = transactionType === 'expense' ? await expensesService.getAll(selectedWallet?._id) : await incomesService.getAll(selectedWallet?._id);
        }
    
        setTransactions(response.data);
    }

    const withWalletAndData = <T, K>(
        action: (data: T, walletId: string) => Promise<K>
    ) => {
        return (data: T) => {
            const currentWallet = selectedWallet;
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
            const currentWallet = selectedWallet;
            if (!currentWallet) {
                return Promise.reject({message: "No wallet selected"});
            }
            return action(currentWallet._id, ...args);
        };
    };

    const addIncome = (data:Income) => {
        setTransactions(prev => [...prev, data]);
        return withWalletAndData(incomesService.add)(data);
    };
    const addExpense = (data:Expense) => {
        setTransactions(prev => [...prev, data]);
        return withWalletAndData(expensesService.add)(data);
    };
    const removeIncome =withWalletAndData(incomesService.remove);

    const getExpenses = withWallet((walletId: string, params: any = {}) => expensesService.getAll(params, walletId));
    const getIncomes = withWallet(incomesService.getAll);
    const removeExpense = withWalletAndData(expensesService.remove);

    return (
        <WalletContext.Provider
            value={{
                wallets,
                selectedWallet,
                isLoading,
                error,
                setSelectedWallet,
                refreshWallets: fetchWallets,
                createWallet,
                updateWallet,
                deleteWallet,
                addExpense,
                getExpenses,
                getIncomes,
                addIncome,
                removeExpense,
                removeIncome,
                transactionType,
                setTransactions,
                setTransactionType,
                transactions,
                refetchTrigger,
                triggerRefetch,
                fetchTransactions
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}