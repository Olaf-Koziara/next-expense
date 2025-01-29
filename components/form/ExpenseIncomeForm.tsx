'use client';
import React, {useEffect, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import DatePicker from '@/components/ui/datepicker';
import {Input} from '@/components/ui/input';
import {Form, FormControl, FormField, FormItem, FormLabel} from '@/components/ui/form';
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Category} from '@/types/Category';
import {Button} from '@/components/ui/button';
import {useWallet} from '@/context/WalletContext';
import useCategories from "@/hooks/useCategories";

type FormData = {
    title: string;
    amount: number;
    date: string;
    category: Category["name"];
};


type Props = {
    type: 'expense' | 'income';
    onFormSubmitted?: () => void;
};

const ExpenseIncomeForm = ({type, onFormSubmitted}: Props) => {
    const {selectedWallet, addIncome, addExpense} = useWallet();
    const form = useForm<FormData>();
    const {categories} = useCategories({type: type});


    const onSubmit: SubmitHandler<FormData> = async (data, event) => {
        event?.preventDefault();

        if (type === 'expense') {
            await addExpense(data)
        } else {
            await addIncome(data)
        }
        form.reset();
        onFormSubmitted?.();
    };

    return (
        <div>
            <Form {...form}>
                <form className='flex gap-1' onSubmit={form.handleSubmit(onSubmit)}>
                    <DatePicker mode='single' dateFormat='dd-MM-yyyy' {...form.register('date', {required: true})} />
                    <Input placeholder='Title' {...form.register('title', {required: true})} />
                    <Input type='number' placeholder='Amount' {...form.register('amount', {required: true})} />
                    <FormField
                        control={form.control}
                        name='category'
                        rules={{required: true}}
                        render={({field, fieldState}) => (
                            <FormItem>
                                <FormControl>
                                    <Select key={field.value} defaultValue={field.value} value={field.value}
                                            onValueChange={field.onChange}>
                                        <SelectTrigger ref={field.ref} aria-invalid={fieldState['invalid']}
                                                       className='w-full'>
                                            <SelectValue placeholder='Select category'/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {categories.map((category, index) => (
                                                    <SelectItem key={index} value={category.name}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type='submit'>Add {type}</Button>
                </form>
            </Form>
        </div>
    );
};

export default ExpenseIncomeForm;