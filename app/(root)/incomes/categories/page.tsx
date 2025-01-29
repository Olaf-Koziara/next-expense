'use client'
import React, {useEffect, useState} from 'react';
import ExpenseIncomeCategoryForm from "@/components/form/ExpenseIncomeCategoryForm";
import {Category} from "@/types/Category";
import useCategories from '@/hooks/useCategories';
import {DataTable} from "@/components/DataTable/DataTable";
import {ColumnDef} from "@tanstack/react-table";
import {incomeCategoriesService} from "@/app/services/incomeCategories";

const Page = () => {
    const {categories, addCategory} = useCategories({type: 'income'})
    return (
        <div className='pt-3'>
            <h2 className='text-center text-3xl pb-3'>Categories</h2>

            <div className='w-1/2 mx-auto'>
                <div className='pb-3'>
                    <ExpenseIncomeCategoryForm onSubmit={addCategory} type={'income'}/>
                </div>
                <DataTable columns={columns} data={categories} itemRemovable={true}
                           service={incomeCategoriesService}></DataTable>
            </div>
        </div>

    );
};
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

export default Page;