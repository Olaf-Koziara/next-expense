'use client'
import React from 'react';
import ExpenseIncomeCategoryForm from "@/components/form/ExpenseIncomeCategoryForm";
import {Category} from "@/types/Category";

import useCategories from "@/hooks/useCategories";
import {DataTable} from "@/components/DataTable/DataTable";
import {ColumnDef} from "@tanstack/react-table";
import {expenseCategoriesService} from "@/app/services/expenseCategories";

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
    const {categories, addCategory} = useCategories({type: 'expense'})
    return (
        <div className='pt-3'>
            <h2 className='text-center text-3xl pb-3'>Categories</h2>

            <div className='w-1/2 mx-auto'>
                <div className='pb-3'>
                    <ExpenseIncomeCategoryForm type={'expense'} onSubmit={addCategory}/>
                </div>
                <DataTable columns={columns} data={categories} itemRemovable={true}
                           service={expenseCategoriesService}></DataTable>
                {
                    !categories.length && <h4 className='text-center pt-4'>No categories</h4>
                }
            </div>
        </div>

    );
};

export default Page;