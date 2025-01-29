'use client';
import React, {useEffect, useState} from 'react';
import {ColumnDef} from "@tanstack/table-core";
import {Expense} from "@/types/Expense";
import {Category} from "@/types/Category";
import {DataTable,} from "@/components/DataTable/DataTable";
import {Income, TransactionType} from "@/types/Income";
import {useWallet} from "@/context/WalletContext";
import useCategories from "@/hooks/useCategories";
import {incomesService} from "@/app/services/incomes";
import {expensesService} from "@/app/services/expenses";


const formatedDate = (date: Date) => <div>{date.toLocaleDateString('en-GB')}</div>;

type Props = {
    type: TransactionType,
    triggerFetch?: boolean,
}
const ExpenseIncomeTable = ({type, triggerFetch}: Props) => {
    const {selectedWallet} = useWallet();
    const [columns, setColumns] = useState<ColumnDef<Income | Expense>[]>()
    const {categories} = useCategories({type})

    useEffect(() => {
        setColumns(getColumns(categories));

    }, [categories]);


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
        <div>

            {columns &&
                <DataTable columns={columns}
                           dataParentId={selectedWallet ? selectedWallet._id : null}
                           itemRemovable={true}
                           triggerFetch={triggerFetch}
                           service={type === 'income' ? incomesService : expensesService}/>}

        </div>
    );
};

export default ExpenseIncomeTable;