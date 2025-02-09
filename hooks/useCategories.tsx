import {useEffect, useState} from 'react';
import {Category, CategoryArraySchema} from "@/types/Category";


type TransactionType = 'income' | 'expense';


const UseCategories = (type: TransactionType) => {
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchCategories = async () => {
        const response = await fetch(`/api/${type}Categories`);
        const responseJson = await response.json();
        const data: Category[] = CategoryArraySchema.parse(responseJson.data);
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
    }, [type]);

    return {
        categories,
        deleteCategory,
        addCategory,
    };
};

export default UseCategories;
