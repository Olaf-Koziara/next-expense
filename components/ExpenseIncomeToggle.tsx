import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {TransactionType} from "@/types/Expense";

interface ExpenseIncomeToggleProps {
    onChange: (type: TransactionType) => void;
}

const ExpenseIncomeToggle: React.FC<ExpenseIncomeToggleProps> = ({onChange}) => {
    const [selected, setSelected] = useState<TransactionType>('expense');

    const handleToggle = (type: TransactionType) => {
        setSelected(type);
        onChange(type);
    };

    return (
        <div className="flex justify-center relative z-0">
            <Button
                variant={selected === 'expense' ? 'default' : 'outline'}
                onClick={() => handleToggle('expense')}
                className={selected !== 'expense' ? 'rounded-r-none  -mr-1' : ''}
            >
                Expense
            </Button>
            <Button
                variant={selected === 'income' ? 'default' : 'outline'}
                onClick={() => handleToggle('income')}
                className={selected !== 'income' ? 'rounded-l-none  -ml-1 -z-10' : ''}
            >
                Income
            </Button>
        </div>
    );
};

export default ExpenseIncomeToggle;