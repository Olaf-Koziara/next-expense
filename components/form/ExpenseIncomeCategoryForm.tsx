'use client';
import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

type Props = {
    type: 'expense' | 'income';
    onCategoryAdded?: () => void;
};

const ExpenseIncomeCategoryForm = ({type, onCategoryAdded}: Props) => {
    const [name, setName] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch(`/api/${type}Categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name}),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (onCategoryAdded) {
                onCategoryAdded();
            }
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