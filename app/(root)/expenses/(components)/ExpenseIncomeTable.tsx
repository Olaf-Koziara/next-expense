'use client';
import React from 'react';
import {DataTable} from "@/components/DataTable/DataTable";
import {Expense} from "@/types/Expense";
import { useWallet } from '@/context/WalletContext';
import useCategories from "@/hooks/useCategories";
import { Income } from '@/types/Income';
import { expensesService } from "@/app/services/expenses";
import { incomesService } from "@/app/services/incomes";
import { Service } from '@/types/Service';


type Transaction = (Expense | Income) ;

const ExpenseIncomeTable = () => {
    const { selectedWallet,setTransactions,transactionType } = useWallet();
    const {categories} = useCategories(transactionType);
    const service = (transactionType === 'income' ? incomesService : expensesService) as Service<Transaction>;

    const schema = {
        _id: {
            type: 'text' as const,
            label: 'ID',
            editable: false,
            sortable: false,
            filterable: false
        },
        date: {
            type: 'date' as const,
            label: 'Date',
            editable: true,
            sortable: true,
            filterable: true,
            filterVariant: 'dateRange' as const
        },
        title: {
            type: 'text' as const,
            label: 'Title',
            editable: true,
            sortable: true,
            filterable: true,
            filterVariant: 'text' as const
        },
        amount: {
            type: 'number' as const,
            label: 'Amount',
            editable: true,
            sortable: true,
            filterable: true,
            filterVariant: 'range' as const
        },
        category: {
            type: 'select' as const,
            label: 'Category',
            editable: true,
            sortable: true,
            filterable: true,
            filterVariant: 'select' as const,
            options: categories?.map(category => category.name) || []
        }
    };

    if (!selectedWallet?._id) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Please select a wallet to view transactions</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className='max-h-[70vh] overflow-auto'>
                <DataTable
                    service={service}
                    schema={schema}
                    dataParentId={selectedWallet._id}
                    itemRemovable={true}
                    onFetchData={(data) => setTransactions(data as Transaction[])}
                />
            </div>
        </div>
    );
};

export default ExpenseIncomeTable;