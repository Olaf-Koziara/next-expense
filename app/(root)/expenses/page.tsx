'use client';
import React, {useEffect, useState} from 'react';

import ExpenseIncomeForm from "@/components/form/ExpenseIncomeForm";
import ExpenseIncomeTable from "@/components/ExpenseIncomeTable";

// Separate the columns generation logic


const Page = () => {
    const [triggerFetch, setTriggerFetch] = useState(false);

    const handleFormSubmitted = () => {
        setTriggerFetch(prev => !prev);
    };


    return (
        <div className="mt-5">
            <div className="flex flex-col lg:flex-row gap-6">
                <ExpenseIncomeTable triggerFetch={triggerFetch} type={'expense'}/>
                <div className="w-full lg:w-80">
                    <ExpenseIncomeForm type='expense' onFormSubmitted={handleFormSubmitted}/>
                </div>
            </div>
        </div>
    );
};

export default Page;