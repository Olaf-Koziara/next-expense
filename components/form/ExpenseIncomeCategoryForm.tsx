'use client';
import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

type Props = {
    type: 'expense' | 'income';
    onSubmit?: (name: string) => void;
};

const ExpenseIncomeCategoryForm = ({type, onSubmit}: Props) => {
    const [name, setName] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (onSubmit) onSubmit(name);

            setName('');
        } catch (error) {
            console.error(`Failed to create ${type} category:`, error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='flex'>
                <Input
                    type="text"
                    id="name"
                    placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} Category Name`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Button type="submit">Add {type.charAt(0).toUpperCase() + type.slice(1)} Category</Button>
            </div>
        </form>
    );
};

export default ExpenseIncomeCategoryForm;