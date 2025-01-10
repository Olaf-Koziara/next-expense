'use client'
import React, {useEffect, useState} from 'react';
import ExpenseIncomeCategoryForm from "@/components/form/ExpenseIncomeCategoryForm";
import {Category} from "@/types/Category";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Trash} from "lucide-react";
import useCategories from "@/hooks/useCategories";

const Page = () => {
    const {categories, deleteCategory, addCategory} = useCategories({type: 'expense'})

    return (
        <div className='pt-3'>
            <h2 className='text-center text-3xl pb-3'>Categories</h2>

            <div className='w-1/2 mx-auto'>
                <div className='pb-3'>
                    <ExpenseIncomeCategoryForm type={'expense'} onSubmit={addCategory}/>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                Name
                            </TableHead>
                            <TableHead>
                                Created At
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        {
                            categories.length > 0 && categories.map(item =>
                                <TableRow key={item._id}>
                                    <TableCell>
                                        {item.name}
                                    </TableCell>
                                    <TableCell>
                                        {item.createdAt}
                                    </TableCell>
                                    <TableCell>
                                        <button onClick={() => deleteCategory(item._id)}>
                                            <Trash/>
                                        </button>
                                    </TableCell>

                                </TableRow>
                            )

                        }

                    </TableBody>
                </Table>
                {
                    !categories.length && <h4 className='text-center pt-4'>No categories</h4>
                }
            </div>
        </div>

    );
};

export default Page;