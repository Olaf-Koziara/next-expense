'use client';
import React from 'react';
import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './DataTableViewOptions';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter tasks..."
                    value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('title')?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
} 