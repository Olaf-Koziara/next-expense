'use client';
import React, {useEffect, useState} from 'react';
import {Column, ColumnDef, RowData} from "@tanstack/table-core";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import {Expense} from "@/types/Expense";
import {resolve} from "dns";
import {ExpenseCategory} from "@/types/ExpenseCategory";
import {DataTable} from "@/components/dataTable";
import {Income} from "@/types/Income";
import {useWallet} from "@/context/WalletContext";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Skeleton} from "@/components/ui/skeleton";
import {IncomeCategory} from "@/types/IncomeCategory";
import {SortingState} from "@tanstack/react-table";


declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select',
        filterPlaceholder?: string,
        filterOptions?: string[]
    }
}


const formatedDate = (date: Date) => <div>{date.toLocaleDateString('en-GB')}</div>;

type Props = {
    type: 'expense' | 'income'
}
const ExpenseIncomeTable = ({type}: Props) => {
    const {selectedWallet} = useWallet();
    const [data, setData] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [columns, setColumns] = useState<ColumnDef<Income | Expense>[]>()
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetchCategories().then((data) => {
                setColumns(getColumns(data))
            }
        )
    }, []);
    useEffect(() => {
        fetchExpenses()
    }, [selectedWallet]);
    const fetchCategories = async () => {
        const response = await fetch(`/api/${type}Categories`);
        const data = await response.json();
        setCategories(data.expenseCategories)
        return data.expenseCategories;
    }
    const fetchExpenses = async (sortBy?: string, order: 'desc' | 'asc' = 'asc') => {
        if (!selectedWallet?._id) return;

        setIsLoading(true);
        setError(null);

        try {
            const url = sortBy ? `/api/${type}?wallet=${selectedWallet._id}&sortBy=${sortBy}&order=${order}` : `/api/${type}?wallet=${selectedWallet._id}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch expenses');
            const expenseData = await response.json();
            setData(expenseData.expenses);
        } catch (error) {
            setError('Failed to load expenses');
            console.error('Error fetching expenses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSortingChange = async (data: SortingState) => {
        const sorting = data[0];
        if (sorting) {
            await fetchExpenses(sorting.id, sorting.desc ? 'desc' : 'asc')
        }
    }
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
    const getColumns = (categories: ExpenseCategory[] | IncomeCategory[]): ColumnDef<Income | Expense>[] => [{
        accessorKey: 'date',
        header: (data) => sortableHeader(data.column, 'Date', 'date'),
        cell: ({row}) => formatedDate(new Date(row.getValue('date')))
    },
        {
            accessorKey: 'title',
            header: (data) => sortableHeader(data.column, 'Title', 'title'),
            meta: {filterVariant: 'text'}
        },
        {
            accessorKey: 'amount',
            header: (data) => sortableHeader(data.column, 'Amount', 'amount'),
            filterFn: "inNumberRange",
            meta: {filterVariant: 'range'}
        },
        {
            accessorKey: 'category',
            header: (data) => sortableHeader(data.column, 'Category', 'category'),
            meta: {
                filterVariant: 'select',
                filterPlaceholder: 'Category',
                filterOptions: categories.map(category => category.name)
            }
        }];

    return (
        <div>

            {columns && <DataTable columns={columns} data={data} onSortingChange={handleSortingChange}/>}

        </div>
    );
};

export default ExpenseIncomeTable;