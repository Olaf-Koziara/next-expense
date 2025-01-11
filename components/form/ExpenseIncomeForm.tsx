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

export const getCategories = async (type: 'expense' | 'income') => {
    const response = await fetch(`/api/${type}Categories`);
    const data = await response.json();
    return data[`${type}Categories`];
};

type Props = {
    type: 'expense' | 'income';
    onFormSubmitted?: () => void;
};

const ExpenseIncomeForm = ({type, onFormSubmitted}: Props) => {
    const {selectedWallet} = useWallet();
    const form = useForm<FormData>();
    const {categories} = useCategories({type: type});


    const onSubmit: SubmitHandler<FormData> = async (data, event) => {
        event?.preventDefault();
        await fetch(`/api/${type}`, {
            method: 'POST',
            body: JSON.stringify({selectedWalletId: selectedWallet?._id, ...data}),
        });
        if (onFormSubmitted) {
            onFormSubmitted();
        }
        form.reset();
    };

    return (
        <div>
            <Form {...form}>
                <form className='flex flex-col gap-2' onSubmit={form.handleSubmit(onSubmit)}>
                    <DatePicker form={form} name='date'/>
                    <Input placeholder='Title' {...form.register('title')} />
                    <Input type='number' placeholder='Amount' {...form.register('amount')} />
                    <FormField
                        control={form.control}
                        name='category'
                        render={({field, fieldState}) => (
                            <FormItem>
                                <FormControl>
                                    <Select onValueChange={field.onChange}>
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