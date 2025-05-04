'use client';
import React, { useEffect, useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useExpense } from '@/context/ExpenseContext';
import { formatCurrency } from '@/utils/global';
type Props = {
    type: 'expense' | 'income';

};



const ExpenseIncomeTotals = ({ type }: Props) => {
    const { selectedWallet } = useWallet();
    const { expenses } = useExpense();
    const [total, setTotal] = useState(0);
    const [displayTotal, setDisplayTotal] = useState(0);
    const [displayBalance, setDisplayBalance] = useState(0);

    useEffect(() => {
        if(expenses){
        const newTotal = expenses.reduce((sum, item) => sum + item.amount, 0);
        setTotal(newTotal);
        }
    }, [expenses]);

    useEffect(() => {
        const duration = 1; // Animation duration in seconds
        const steps = 60; // Number of steps in the animation
        const stepDuration = (duration * 1000) / steps;
        const increment = total / steps;

        let currentStep = 0;
        setDisplayTotal(0);
        setDisplayBalance(0);
        const interval = setInterval(() => {
            currentStep++;
            if (currentStep <= steps) {
                setDisplayTotal(prev => prev + increment);
                if (type === 'expense') {
                    setDisplayBalance(prev => prev - increment);
                } else {
                    setDisplayBalance(prev => prev + increment);
                }
            } else {
                clearInterval(interval);
            }
        }, stepDuration);

        return () => clearInterval(interval);
    }, [total, type]);

    if (!selectedWallet) return null;

    return (
        <div className="grid grid-cols-2 gap-4 mb-2">
            <Card className={cn(
                "border-2","text-center",
                type === 'expense' ? "border-red-500" : "border-green-500",
             
            )}>
                <CardHeader className='px-6 pt-3 pb-2' >
                    <CardTitle className="text-lg">
                        {type === 'expense' ? 'Total Expenses' : 'Total Income'}
                    </CardTitle>
                </CardHeader>
                <CardContent  className={cn(
                                "text-2xl font-bold",
                                type === 'expense' ? "text-red-500" : "text-green-500","px-6 pt-2 pb-3"
                            )}>
                  
                            {formatCurrency(displayTotal, selectedWallet.currency)}
                  
                </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 text-center">
            <CardHeader className='px-6 pt-3 pb-2' >
            <CardTitle className="text-lg">Wallet Balance</CardTitle>
                </CardHeader>
                <CardContent  className={cn(
                                "text-2xl font-bold",
                                type === 'expense' ? "text-red-500" : "text-green-500","px-6 pt-2 pb-3"
                            )}>
                  
  
                            {formatCurrency(displayBalance, selectedWallet.currency)}
              
                </CardContent>
            </Card>
        </div>
    );
};

export default ExpenseIncomeTotals;