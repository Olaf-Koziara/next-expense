'use client';
import React, {useState} from 'react';
import {ColumnDef} from "@tanstack/react-table";
import {Category} from "@/types/Category";
import useCategories from "@/hooks/useCategories";
import {DataTable} from "@/components/DataTable/DataTable";
import {expenseCategoriesService} from "@/app/services/expenseCategories";
import CategoryForm from "@/app/(root)/categories/(components)/CategoryForm";
import {TransactionType} from "@/types/Expense";
import TransactionTypeToggle from "@/components/TransactionTypeToggle";
import {incomeCategoriesService} from "@/app/services/incomeCategories";

const columns: ColumnDef<Category>[] = [{
    accessorKey: '_id',
    enableHiding: true,
}, {
    accessorKey: 'name',
    meta: {
        editable: true,
        sortable: true,
    }
}, {
    accessorKey: 'createdAt',
    meta: {
        editable: true,
        fieldVariant: 'date',
        sortable: true,
    }
}]
const Page = () => {
    const [transactionType, setTransactionType] = useState<TransactionType>('expense');
    const {categories, addCategory} = useCategories(transactionType)

    return (
        <div className='pt-3'>
            <h2 className='text-center text-3xl pb-3'>Categories</h2>

            <div className='w-1/2 mx-auto'>
                <TransactionTypeToggle onChange={setTransactionType}/>
                <div className='py-3'>
                    <CategoryForm type={transactionType} onSubmit={addCategory}/>
                </div>
                <DataTable columns={columns} data={categories} itemRemovable={true}
                           service={transactionType === 'expense' ? expenseCategoriesService : incomeCategoriesService}></DataTable>
                {
                    !categories.length && <h4 className='text-center pt-4'>No categories</h4>
                }
            </div>
        </div>

    );
};


export default Page;