'use client';
import React, {useEffect, useState} from 'react';

import ExpenseIncomeForm from "@/app/(root)/expenses/(components)/ExpenseIncomeForm";
import ExpenseIncomeTable from "@/app/(root)/expenses/(components)/ExpenseIncomeTable";
import ExpenseIncomeToggle from "@/app/(root)/expenses/(components)/ExpenseIncomeToggle";
import {TransactionType} from "@/types/Expense";

// Separate the columns generation logic


const Page = () => {
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [transactionType, setTransactionType] = useState<TransactionType>('expense');

    const handleFormSubmitted = () => {
        setTriggerFetch(prev => !prev);
    };


    return (
        <div className="mt-3">
            <div className="mx-auto w-4/5 flex flex-col items-center">
                <ExpenseIncomeToggle onChange={setTransactionType}/>
                <div className='w-2/3 min-w-fit mt-10'>
                    <div className='mb-5 drop-shadow-xl shadow-white flex justify-center'>
                        <ExpenseIncomeForm type={transactionType} onFormSubmitted={handleFormSubmitted}/>
                    </div>

                    <ExpenseIncomeTable triggerFetch={triggerFetch} type={transactionType}/>
                </div>

            </div>
        </div>
    );
};

export default Page;