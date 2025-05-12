'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense } from '@/types/Expense';
import { useWallet } from './WalletContext';
import { incomesService } from '@/app/services/incomes';
import { expensesService } from '@/app/services/expenses';

type ExpenseIncomeContextType = {
    data: Expense[];
    loading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
};

const ExpenseIncomeContext = createContext<ExpenseIncomeContextType>({
    data: [],
    loading: false,
    error: null,
    refreshData: async () => {},
});

export const useExpenseIncome = () => useContext(ExpenseIncomeContext);

type Props = {
    children: React.ReactNode;
    type: 'expense' | 'income';
};

export const ExpenseIncomeProvider = ({ children, type }: Props) => {
    const { selectedWallet } = useWallet();
    const [data, setData] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!selectedWallet) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const service = type === 'income' ? incomesService : expensesService;
            const response = await service.getAll(selectedWallet._id);
            setData(response.data || []);
        } catch (err) {
            setError('Failed to fetch data');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedWallet, type]);

    const refreshData = async () => {
        await fetchData();
    };

    return (
        <ExpenseIncomeContext.Provider value={{ data, loading, error, refreshData }}>
            {children}
        </ExpenseIncomeContext.Provider>
    );
}; 