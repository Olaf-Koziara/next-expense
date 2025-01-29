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
            <div className="mx-auto w-4/5">
                <div className='mb-5 drop-shadow-xl shadow-white'>
                    <ExpenseIncomeForm type='expense' onFormSubmitted={handleFormSubmitted}/>
                </div>
                <ExpenseIncomeTable triggerFetch={triggerFetch} type={'expense'}/>

            </div>
        </div>
    );
};

export default Page;