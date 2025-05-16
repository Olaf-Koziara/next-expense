'use client';
import React, {useState} from 'react';
import useCategories from "@/hooks/useCategories";
import {DataTable} from "@/components/DataTable/DataTable";
import {expenseCategoriesService} from "@/app/services/expenseCategories";
import {TransactionType} from "@/types/Expense";
import TransactionTypeToggle from "@/components/TransactionTypeToggle";
import {incomeCategoriesService} from "@/app/services/incomeCategories";

const Page = () => {
    const [transactionType, setTransactionType] = useState<TransactionType>('expense');
    const {categories} = useCategories(transactionType)
    const schema = {
        name: {
            type: 'text' as const,
            label: 'Name',
            editable: true,
        }
    }
    return (
        <div className='pt-3'>
            <h2 className='text-center text-3xl pb-3'>Categories</h2>

            <div className='w-1/2 mx-auto'>
                <TransactionTypeToggle onChange={setTransactionType}/>
          
                <DataTable schema={schema}  itemRemovable={true} form={true}
                           service={transactionType === 'expense' ? expenseCategoriesService : incomeCategoriesService}></DataTable>
                {
                    !categories.length && <h4 className='text-center pt-4'>No categories</h4>
                }
            </div>
        </div>

    );
};


export default Page;