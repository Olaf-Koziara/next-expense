import React, {useEffect, useState} from 'react';
import {Category, CategoryArraySchema, CategorySchema} from "@/types/Category";


type TransactionType = 'income' | 'expense';
type Props<T extends TransactionType> = {
    type: T;
};


const UseCategories = <T extends TransactionType>({type}: Props<T>) => {
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchCategories = async () => {
        const response = await fetch(`/api/${type}Categories`);
        const data: Category[] = CategoryArraySchema.parse(await response.json());
        setCategories(data);
    };

    const deleteCategory = async (_id: string) => {
        await fetch(`/api/${type}Categories`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({_id}),
        });
        await fetchCategories();
    };


    const addCategory = async (name: string) => {
        await fetch(`/api/${type}Categories`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name}),
        });
        await fetchCategories();
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        deleteCategory,
        addCategory,
    };
};

export default UseCategories;
