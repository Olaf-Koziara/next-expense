'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CurrencySelect } from '@/app/(root)/(components)/Currency/CurrencySelect';
import { useWallet } from '@/context/WalletContext';

export const ExpenseIncomeForm = () => {

    const {selectedWallet,addExpense,addIncome,transactionType} = useWallet();

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [category, setCategory] = useState('');
    const [currency, setCurrency] = useState(selectedWallet?.currency || 'USD');
    const addTransaction = (transactionData:any) => {
        if(transactionType === 'expense'){
            addExpense(transactionData);
        }else{
            addIncome(transactionData);
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedWallet) return;

        const transactionData = {
            title: description,
            amount: Number(amount),
            category,
            date: date.toISOString(),
            currency: selectedWallet.currency
        };

         addTransaction(transactionData);
        setAmount('');
        setDescription('');
        setDate(new Date());
        setCategory('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={transactionType} onValueChange={(value) => setTransactionType(value as 'expense' | 'income')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                    />
                </div>
            </div>
            <CurrencySelect
                        value={currency}
                        onValueChange={setCurrency}
                        className="w-[120px]"
                    />
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Enter category"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(newDate) => newDate && setDate(newDate)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <Button type="submit" className="w-full">
                Add {transactionType === 'expense' ? 'Expense' : 'Income'}
            </Button>
        </form>
    );
}; 