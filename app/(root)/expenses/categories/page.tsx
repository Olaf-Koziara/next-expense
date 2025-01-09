'use client'
import React, {useEffect, useState} from 'react';
import ExpenseIncomeCategoryForm from "@/components/form/ExpenseIncomeCategoryForm";
import {ExpenseCategory} from "@/types/ExpenseCategory";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Trash} from "lucide-react";

const Page = () => {
    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([])
    const fetchExpenseCategories = () => {
        fetch('/api/expenseCategories').then(data => data.json().then(data => setExpenseCategories(data.expenseCategories)));

    }
    const deleteExpenseCategory = (_id: string) => {
        fetch('/api/expenseCategories', {
            method: 'DELETE',
            body: JSON.stringify({_id})
        }).then(() => fetchExpenseCategories());
    }
    useEffect(() => {
        fetchExpenseCategories();
    }, []);
    return (
        <div className='pt-3'>
            <h2 className='text-center text-3xl pb-3'>Categories</h2>

            <div className='w-1/2 mx-auto'>
                <div className='pb-3'>
                    <ExpenseIncomeCategoryForm type={'expense'} onCategoryAdded={fetchExpenseCategories}/>
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
                            expenseCategories && expenseCategories.map(item =>
                                <TableRow key={item._id}>
                                    <TableCell>
                                        {item.name}
                                    </TableCell>
                                    <TableCell>
                                        {item.createdAt}
                                    </TableCell>
                                    <TableCell>
                                        <button onClick={() => deleteExpenseCategory(item._id)}>
                                            <Trash/>
                                        </button>
                                    </TableCell>

                                </TableRow>
                            )

                        }

                    </TableBody>
                </Table>
                {
                    !expenseCategories.length && <h4 className='text-center pt-4'>No categories</h4>
                }
            </div>
        </div>

    );
};

export default Page;