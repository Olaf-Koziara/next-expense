'use client';
import React, {useEffect} from 'react';
import {useWallet} from "@/context/WalletContext";
import {Income} from "@/types/Income";
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