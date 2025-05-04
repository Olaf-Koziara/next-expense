'use client';
import React, {useEffect, useState} from 'react';
import {ColumnDef} from "@tanstack/react-table";
import {DataTable} from "@/components/DataTable/DataTable";
import {Expense, TransactionType} from "@/types/Expense";
import {Service} from "@/types/Service";
import ExpenseIncomeTotals from './ExpenseIncomeTotals';
import { useExpense } from '@/context/ExpenseContext';
import { useWallet } from '@/context/WalletContext';
import useCategories from "@/hooks/useCategories";
import { expensesService } from "@/app/services/expenses";
import { incomesService } from "@/app/services/incomes";
import { Category } from '@/types/Category';
import { Income } from '@/types/Income';

interface Props {
    type: TransactionType;
    triggerFetch: boolean;
    onFetch?: (data: Expense[]) => void;
}
const formatedDate = (date: Date) => <div>{date.toLocaleDateString('en-GB')}</div>;


const ExpenseIncomeTable = ({type, triggerFetch, onFetch}: Props) => {
    const {selectedWallet} = useWallet();
    const [columns, setColumns] = useState<ColumnDef<Expense, Expense>[]>()
    const { setExpenses } = useExpense();
    const {categories} = useCategories(type)
    useEffect(() => {
        setColumns(getColumns(categories));
    }, []);
    const service: Service<Expense> = type === 'income' ? incomesService : expensesService;

    const handleFetch = (data: Expense[]) => {
       setExpenses(data);
    };
    const getColumns = (categories: Category[]): ColumnDef<Income | Expense>[] => [
        {
            accessorKey: '_id',
            enableHiding: true,

        }
        , {
            accessorKey: 'date',
            cell: ({row}) => formatedDate(new Date(row.getValue('date'))),
            meta: {
                filterVariant: 'dateRange',
                editable: true,
                fieldVariant: 'date',
                sortable: true
            }
        },
        {
            accessorKey: 'title',
            meta: {filterVariant: 'text', editable: true, sortable: true}
        },
        {
            accessorKey: 'amount',
            filterFn: "inNumberRange",
            meta: {filterVariant: 'range', editable: true, sortable: true}
        },
        {
            accessorKey: 'category',
            meta: {
                filterVariant: 'select',
                filterPlaceholder: 'Category',
                filterOptions: categories ? categories.map(category => category.name) : [],
                editable: true,
                sortable: true
            }
        },
    ];

    return (
        <div className="space-y-4">
     
            <div className='max-h-[70vh] overflow-auto'>
                {columns &&
                    <DataTable
                        columns={columns}
                        dataParentId={selectedWallet ? selectedWallet._id : null}
                        manualPagination={true}
                        service={service}
                        onFetch={handleFetch}
                    />}
            </div>
        </div>
    );
}

export default ExpenseIncomeTable;