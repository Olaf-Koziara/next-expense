'use client';
import React, { useState } from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import DatePicker from '@/components/ui/datepicker';
import {Input} from '@/components/ui/input';
import {Form, FormControl, FormField, FormItem} from '@/components/ui/form';
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import useCategories from "@/hooks/useCategories";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useWallet} from "@/context/WalletContext";
import { PlusCircle } from 'lucide-react';

type FormData = z.infer<typeof FormSchema>;
const FormSchema = z.object({
    title: z.string().nonempty('Title is required'),
    amount: z.coerce.number().gte(0, 'Amount must be a positive number'),
    date: z.string().nonempty('Date is required'),
    category: z.string().nonempty('Category is required'),
})

type Props = {
    type: 'expense' | 'income';
    onFormSubmitted?: () => void;
};

const ExpenseIncomeForm = ({type, onFormSubmitted}: Props) => {
    const form = useForm<FormData>({resolver: zodResolver(FormSchema)});
    const {categories, addCategory} = useCategories(type);
    const {addIncome, addExpense, selectedWallet} = useWallet();
    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            addCategory(newCategory.trim());
            form.setValue('category', newCategory.trim());
            setNewCategory('');
            setIsAddingCategory(false);
        }
    };

    const onSubmit: SubmitHandler<FormData> = async (data, event) => {
        event?.preventDefault();

        const formData = {
            ...data,
            currency: selectedWallet?.currency || 'USD'
        };

        if (type === 'expense') {
            await addExpense(formData)
        } else {
            await addIncome(formData)
        }
        form.reset();
        onFormSubmitted?.();
    };

    return (
        <div className='border-2 border-gray-600 rounded-md p-2 h-full'>
            <Form {...form}>
                <form className='flex gap-1' onSubmit={form.handleSubmit(onSubmit)}>
                    <DatePicker error={form.formState.errors.date} mode='single' formatValueToString={true}
                                dateFormat='dd-MM-yyyy' {...form.register('date', {required: true})} />
                    <Input error={form.formState.errors.title}
                           placeholder='Title' {...form.register('title', {required: true})} />
                    <Input error={form.formState.errors.amount} type='number'
                           placeholder='Amount' {...form.register('amount', {required: true})} />
                    <FormField
                        control={form.control}
                        name='category'
                        rules={{required: true}}
                        render={({field, fieldState}) => (
                            <FormItem>
                                <FormControl>
                                    <Select key={field.value} defaultValue={field.value} value={field.value}
                                            onValueChange={field.onChange}>
                                        <div>{form.formState.errors.category && <span
                                            className="error-message absolute -translate-y-full top-0 text-red-600 text-sm">{form.formState.errors.category.message}</span>}
                                            <SelectTrigger ref={field.ref} aria-invalid={fieldState['invalid']}
                                                           className='w-full'>
                                                <SelectValue placeholder='Select category'/>
                                            </SelectTrigger>
                                        </div>
                                        <SelectContent>
                                            <SelectGroup key="category-group">
                                                {categories.map((category) => (
                                                    <SelectItem key={`category-${category.name}`} value={category.name}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                                <div key="add-category" className="px-2 py-1.5">
                                                    {isAddingCategory ? (
                                                        <div className="flex gap-1">
                                                            <Input
                                                                value={newCategory}
                                                                onChange={(e) => setNewCategory(e.target.value)}
                                                                placeholder="New category name"
                                                                className="h-8"
                                                                autoFocus
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={handleAddCategory}
                                                                className="h-8"
                                                            >
                                                                Add
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="w-full justify-start gap-2"
                                                            onClick={() => setIsAddingCategory(true)}
                                                        >
                                                            <PlusCircle size={16} />
                                                            Add new category
                                                        </Button>
                                                    )}
                                                </div>
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