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


declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select' | 'dateRange',
        filterPlaceholder?: string,
        filterOptions?: string[]
    }
}


const formatedDate = (date: Date) => <div>{date.toLocaleDateString('en-GB')}</div>;

type Props = {
    type: TransactionType,
    triggerFetch?: boolean,
}
const ExpenseIncomeTable = ({type, triggerFetch = true}: Props) => {
    const {selectedWallet, getExpenses, getIncomes} = useWallet();
    const [data, setData] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [columns, setColumns] = useState<ColumnDef<Income | Expense>[]>()
    const {categories} = useCategories({type})

    useEffect(() => {
        fetchData()

    }, [selectedWallet, triggerFetch]);
    useEffect(() => {
        setColumns(getColumns(categories));

    }, [categories]);
    const fetchData = async (params?: QueryParams) => {
        if (selectedWallet) {
            let data: Transaction[];
            if (type === "income") {
                data = await getIncomes(params);
            } else {
                data = await getExpenses(params);
            }
            setData(data);
        }
    }


    const handleFilterAndSortChange = async (data: SortFilterState) => {
        let filterObject: QueryParams = {};
        for (let x = 0; x < data.length; x++) {
            const item = data[x];
            const key = data[x].id;
            if ('value' in item) {
                const value = String(item.value)
                if (value.includes(',')) {
                    const splittedValue = value.split(',');
                    filterObject[`${key}Start`] = splittedValue[0];
                    if (splittedValue[1]) {
                        filterObject[`${key}End`] = splittedValue[1];
                    }
                } else {
                    filterObject[key] = value;
                }
            } else if ('desc' in item) {
                filterObject['sortBy'] = item.id;
                filterObject['sortOrder'] = item.desc ? 'desc' : 'asc'
            }
        }
        await fetchData(filterObject)
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
    const getColumns = (categories: Category[]): ColumnDef<Income | Expense>[] => [{
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
                filterOptions: categories ? categories.map(category => category.name) : []
            }
        },
        {
            accessorKey: 'remove',
            header: '',
            // cell: ({row}) => <Button onClick={}><Trash2/></Button>,

        }];

    return (
        <div>

            {columns &&
                <DataTable columns={columns} data={data} onFilterChange={handleFilterAndSortChange}
                           onSortingChange={handleFilterAndSortChange}/>}

        </div>
    );
};

export default ExpenseIncomeTable;