import React from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {TransactionType} from "@/types/Expense";
import useCategories from "@/hooks/useCategories";

type Props = {
    addCategory: (name: string) => void;
}
const CategoryForm = ({addCategory}: Props) => {
    const [name, setName] = React.useState('')
    const handleCategoryAdd = () => {
        addCategory(name)
        setName('')
    }
    return (
        <div className='flex'>
            <Input onChange={e => setName(e.target.value)} placeholder='Category Name'/>
            <Button onClick={handleCategoryAdd}><Plus/></Button>
        </div>
    );
};

export default CategoryForm;