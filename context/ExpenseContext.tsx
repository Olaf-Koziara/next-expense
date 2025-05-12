'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Expense } from '@/types/Expense';

interface ExpenseContextType {
    expenses: Expense[];
    setExpenses: (expenses: Expense[]) => void;
}

const ExpenseContext = createContext<ExpenseContextType >({
    expenses: [],
    setExpenses: () => {}
});

export function ExpenseProvider({ children }: { children: ReactNode }) {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    return (
        <ExpenseContext.Provider value={{ expenses, setExpenses }}>
            {children}
        </ExpenseContext.Provider>
    );
}

export function useExpense() {
    const context = useContext(ExpenseContext);
    if (context === undefined) {
        throw new Error('useExpense must be used within an ExpenseProvider');
    }
    return context;
} 