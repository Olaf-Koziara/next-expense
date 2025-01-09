'use client';
import React, {useEffect} from 'react';
import {useWallet} from "@/context/WalletContext";
import {Income} from "@/types/Income";
import ExpenseIncomeTable from "@/components/ExpenseIncomeTable";

const Page = () => {
 

    return (
        <div>
            <ExpenseIncomeTable type={'income'}/>
        </div>
    );
};

export default Page;