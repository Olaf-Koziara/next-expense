import React from 'react';
import {flexRender, Header} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {ArrowDown, ArrowUp, ArrowUpDown} from 'lucide-react';

interface DataTableHeaderProps<TData, TValue> {
    header: Header<TData, TValue>;
}

const DataTableHeader = <TData, TValue>({header}: DataTableHeaderProps<TData, TValue>) => {
    if (header.isPlaceholder) {
        return null;
    }

    const column = header.column;

    return column.columnDef.meta?.sortable ? (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            {flexRender(column.columnDef.header, header.getContext())}
            {column.getIsSorted() === 'asc' ? (
                <ArrowDown className="ml-2 h-4 w-4"/>
            ) : column.getIsSorted() === 'desc' ? (
                <ArrowUp className="ml-2 h-4 w-4"/>
            ) : (
                <ArrowUpDown className="ml-2 h-4 w-4"/>
            )}
        </Button>
    ) : (
        flexRender(column.columnDef.header, header.getContext())
    );
};

export default DataTableHeader;