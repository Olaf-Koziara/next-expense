'use client';
import React, {useEffect, useState} from 'react';
import {Column, ColumnDef, ColumnFilter, RowData} from "@tanstack/table-core";
import {Button} from "@/components/ui/button";
import {ArrowUpDown, Trash2} from "lucide-react";
import {Expense} from "@/types/Expense";
import {Category} from "@/types/Category";
import {DataTable, SortFilterState} from "@/components/dataTable";
import {Income, Transaction, TransactionType} from "@/types/Income";
import {useWallet} from "@/context/WalletContext";
import useCategories from "@/hooks/useCategories";
import {QueryParams} from "@/app/services/api";
import {incomesService} from "@/app/services/incomes";
import {expensesService} from "@/app/services/expenses";


const formatedDate = (date: Date) => <div>{date.toLocaleDateString('en-GB')}</div>;

type Props = {
    type: TransactionType,
    triggerFetch?: boolean,
}
const ExpenseIncomeTable = ({type, triggerFetch = true}: Props) => {
    const {selectedWallet, getExpenses, getIncomes, removeExpense, removeIncome} = useWallet();
    const [data, setData] = useState<Transaction[]>([]);
    const [filter, setFilter] = useState<SortFilterState>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [columns, setColumns] = useState<ColumnDef<Income | Expense>[]>()
    const {categories} = useCategories({type})

    useEffect(() => {
        setColumns(getColumns(categories));

    }, [categories]);

   
    const sortableHeader = (column: Column<Expense>, header: string, property: keyof Expense) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                {header}
                <ArrowUpDown className="ml-2 h-4 w-4"/>
            </Button>
        )
    }
    const getColumns = (categories: Category[]): ColumnDef<Income | Expense>[] => [
        {
            accessorKey: '_id',
            enableHiding: true,

        }
        , {
            accessorKey: 'date',
            header: (data) => sortableHeader(data.column, 'Date', 'date'),
            cell: ({row}) => formatedDate(new Date(row.getValue('date'))),
            meta: {
                filterVariant: 'dateRange'
            }
        },
        {
            accessorKey: 'title',
            header: (data) => sortableHeader(data.column, 'Title', 'title'),
            meta: {filterVariant: 'text', editable: true}
        },
        {
            accessorKey: 'amount',
            header: (data) => sortableHeader(data.column, 'Amount', 'amount'),
            filterFn: "inNumberRange",
            meta: {filterVariant: 'range', editable: true}
        },
        {
            accessorKey: 'category',
            header: (data) => sortableHeader(data.column, 'Category', 'category'),
            meta: {
                filterVariant: 'select',
                filterPlaceholder: 'Category',
                filterOptions: categories ? categories.map(category => category.name) : [],
                editable: true
            }
        },
    ];

    return (
        <div>

            {columns &&
                <DataTable columns={columns} data={data}
                           dataParentId={selectedWallet?._id}
                           service={type === 'income' ? incomesService : expensesService}/>}

        </div>
    );
};

export default ExpenseIncomeTable;