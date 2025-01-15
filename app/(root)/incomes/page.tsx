'use client';
import React from 'react';
import ExpenseIncomeTable from "@/components/ExpenseIncomeTable";
import ExpenseIncomeForm from "@/components/form/ExpenseIncomeForm";

const Page = () => {

    return (
        <div className="mt-5">
            <div className="flex flex-col lg:flex-row gap-6">
                <ExpenseIncomeTable type={'income'}/>
                <div className="w-full lg:w-80">
                    <ExpenseIncomeForm type='income'/>
                </div>
            </div>
        </div>
    );
};

export default Page;