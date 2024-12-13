import React from 'react';
import {DataTable} from "@/components/dataTable";
import {columns, Expense} from "@/app/(root)/expenses/columns";
import {generateExpenses} from "@/components/dataGenerator";
import ExpenseForm from "@/components/form/ExpenseForm";

const data: Expense[] = generateExpenses(200);
const Page = async () => {
    return (
        <div>
            <DataTable columns={columns} data={data}/>
            <ExpenseForm/>
        </div>
    );
};

export default Page;