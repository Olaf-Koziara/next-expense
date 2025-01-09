'use client';
import React, {useEffect, useState} from 'react';
import {DataTable} from "@/components/dataTable";
import {Expense} from '@/types/Expense';
import {ColumnDef} from "@tanstack/table-core";
import ExpenseForm from "@/components/form/ExpenseForm";
import {useWallet} from "@/context/WalletContext";
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Skeleton} from '@/components/ui/skeleton';
import {generateColumns} from './columns';
import ExpenseIncomeForm from "@/components/form/ExpenseIncomeForm";
import ExpenseIncomeTable from "@/components/ExpenseIncomeTable";

// Separate the columns generation logic


const Page = () => {


    return (
        <div className="mt-5">
            <div className="flex flex-col lg:flex-row gap-6">
                <ExpenseIncomeTable type={'expense'}/>
                <div className="w-full lg:w-80">
                    {/*<ExpenseIncomeForm type='expense' onFormSubmitted={fetchExpenses}/>*/}
                </div>
            </div>
        </div>
    );
};

export default Page;