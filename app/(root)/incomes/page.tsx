'use client';
import React, {useState} from 'react';
import ExpenseIncomeTable from "@/app/(root)/expenses/(components)/ExpenseIncomeTable";
import ExpenseIncomeForm from "@/app/(root)/expenses/(components)/ExpenseIncomeForm";

const Page = () => {
    const [triggerFetch, setTriggerFetch] = useState(false);

    const handleFormSubmitted = () => {
        setTriggerFetch(prev => !prev);
    };


    return (
        <div className="mt-5">
            <div className="flex flex-col lg:flex-row gap-6">
                <ExpenseIncomeTable type={'income'} triggerFetch={triggerFetch}/>
                <div className="w-full lg:w-80">
                    <ExpenseIncomeForm type='income' onFormSubmitted={handleFormSubmitted}/>
                </div>
            </div>
        </div>
    );
};

export default Page;