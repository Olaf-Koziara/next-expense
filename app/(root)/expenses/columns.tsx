'use client';
import {Column, ColumnDef, RowData} from "@tanstack/table-core";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import mongoose from "mongoose";
import {ExpenseCategory} from "@/models/expense";
import {connectMongoDB} from "@/lib/mongodb";
import {aws4} from "mongodb/src/deps";

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select',
        filterPlaceholder?: string,
        filterOptions?:ExpenseCategory[]
    }
}
export interface Expense {
    date: Date;
    title: string;
    amount: number;
    category: string;
}
export interface ExpenseCategory{
    title: string;
}
const sortableHeader = (column: Column<Expense>, header: string) => {
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
const getExpenseCategories = async ()=>{
    const response =await fetch(`/api/expenseCategories`)
    const data =await response.json();
    return data.expenseCategories
}
const formatedDate = (date: Date) => <div>{date.toLocaleDateString('en-GB')}</div>;

 const generateColumns = async ()=>{
    const categories = await getExpenseCategories()
    const columns: ColumnDef<Expense>[] = [
        {
            accessorKey: 'date',

            header: (data) => sortableHeader(data.column, 'Date'),
            cell: ({row}) => formatedDate(row.getValue('date'))
        },
        {
            accessorKey: 'title',
            header: (data) => sortableHeader(data.column, 'Title'),
            meta:{filterVariant:'text'}
        },
        {
            accessorKey: 'amount',
            header: (data) => sortableHeader(data.column, 'Amount'),filterFn:"inNumberRange",
            meta:{filterVariant: 'range'}
        },
        {
            accessorKey: 'category',
            header: (data) => sortableHeader(data.column, 'Category'),
            meta:{filterVariant: 'select',filterPlaceholder:'Category',filterOptions:categories}
        },]
    return columns;
}
export const columns = await generateColumns();
