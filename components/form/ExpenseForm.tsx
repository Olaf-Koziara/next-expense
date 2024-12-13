'use client';
import React from 'react';
import {useForm} from "react-hook-form";
import DatePicker from "@/components/ui/datepicker";
import {Input} from "@/components/ui/input";
import {Form} from "@/components/ui/form";

type expenseFormData = {
    title: string,
    date: string
}
const ExpenseForm = () => {
    const form = useForm()
    return (
        <div>
            <Form {...form}>
                <DatePicker form={form} name='date'/>
                <Input {...form.register('title')} />
            </Form>
        </div>
    );
};

export default ExpenseForm;