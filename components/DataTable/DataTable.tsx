"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import {Loader2, PenIcon, Save, Trash2} from "lucide-react";
import React, {useEffect, useMemo} from "react";
import DataTableFilter from "@/components/DataTable/DataTableFilter";
import {Service} from "@/types/Service";
import DataTableEditField from "@/components/DataTable/DataTableEditField";
import DataTableHeader from "@/components/DataTable/DataTableHeader";
import {DataTablePagination} from "@/components/DataTable/DataTablePagination";
import {DataTableToolbar} from "@/components/DataTable/DataTableToolbar";
import { useDataTable } from './hooks/useDataTable';
import { useRowEdit } from './hooks/useRowEdit';
import { useItemRemove } from './hooks/useItemRemove';
import { DataTableForm } from './DataTableForm';

const formatDate = (date: string | Date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).replace(/\//g, '-');
};

export type SchemaField = {
    type: 'text' | 'number' | 'date' | 'select' | 'currency';
    label: string;
    options?: string[];
    editable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    filterVariant?: 'text' | 'range' | 'dateRange' | 'select';
}

export type Schema = {
    [key: string]: SchemaField;
}

type Props<TData> = {
    service: Service<TData>;
    schema: Schema;
    dataParentId?: string | null;
    itemRemovable?: boolean;
    defaultCurrency?: string;
    onFetchData?: (data: TData[]) => void;
    form?: boolean;
    initialData?: TData[];
    initialSorting?: { id: string; desc: boolean }[];
    initialFilters?: { id: string; value: unknown }[];
    initialPageSize?: number;
    onDataChange?: (data: TData[]) => void;
    onSortingChange?: (sorting: { id: string; desc: boolean }[]) => void;
    onFiltersChange?: (filters: { id: string; value: unknown }[]) => void;
    onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;

}

export function DataTable<TData extends { _id: string }>({
    service,
    schema,
    dataParentId,
    itemRemovable = false,
    onFetchData,
    form = false,
    initialData,
    initialSorting,
    initialFilters,
    initialPageSize = 10,
    onDataChange,
    onSortingChange,
    onFiltersChange,
    onPaginationChange,

}: Props<TData>) {
    const {
        data,
        pageCount,
        isLoading,
        pagination,
        setPagination,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        fetchData,
    } = useDataTable(service, dataParentId, {
        initialData:initialData,
        initialSorting,
        initialFilters,
        initialPageSize,
    });

    useEffect(() => {
        
        if(onFetchData){
          
            onFetchData(data);
        }
   
        if(onDataChange) {
            onDataChange(data);
        }
    
    }, [isLoading]);

    useEffect(() => {
        if(onSortingChange) {
            onSortingChange(sorting);
        }
    }, [sorting, onSortingChange]);

    useEffect(() => {
        if(onFiltersChange) {
            onFiltersChange(columnFilters);
        }
    }, [columnFilters, onFiltersChange]);

    useEffect(() => {
        if(onPaginationChange) {
            onPaginationChange(pagination);
        }
    }, [pagination, onPaginationChange]);

    const {
        rowInEditId,
        rowInEdit,
        handleItemEdit,
        handleItemInputChange
    } = useRowEdit(service, dataParentId, fetchData);

    const { handleItemRemove } = useItemRemove(service, dataParentId, fetchData);

    const columns = useMemo(() => {
        return Object.entries(schema).map(([key, field]) => ({
            accessorKey: key,
            header: field.label,
            meta: {
                filterVariant: field.filterVariant,
                editable: field.editable,
                fieldVariant: field.type,
                sortable: field.sortable,
                filterOptions: field.options,
                filterable: field.filterable
            }
        })) as ColumnDef<TData, unknown>[];
    }, [schema]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        manualSorting: true,
        manualFiltering: true,
        manualPagination: true,
        pageCount,
        state: {
            pagination,
            sorting,
            columnFilters,
            columnVisibility: {
                _id: false
            }
        },
    });

    return (
        <div className="space-y-4">
            {form && (
                <DataTableForm
                    service={service}
                    schema={schema}
                    dataParentId={dataParentId}
                    onSuccess={fetchData}
                />
            )}
            <DataTableToolbar table={table}/>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.column.getCanFilter() ? (
                                            <div>
                                                <DataTableFilter column={header.column}/>
                                            </div>
                                        ) : null}
                                        <DataTableHeader header={header}/>
                                    </TableHead>
                                ))}
                                {columns.some((column) => column.meta?.editable) && (
                                    <TableHead>Edit</TableHead>
                                )}
                                {itemRemovable && <TableHead>Remove</TableHead>}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading
                            ? <TableRow>
                                <TableCell colSpan={!itemRemovable ? columns.length : columns.length + 1}
                                           className="h-24 text-center">
                                    <Loader2 className='animate-spin m-auto' size={'64'}/>
                                </TableCell>
                            </TableRow> :

                            table && table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {rowInEditId === row.id ? (
                                                    <DataTableEditField
                                                        column={cell.column}
                                                        value={rowInEdit?.[cell.column.id as keyof TData]}
                                                        onChange={(value) => handleItemInputChange(value, cell.column.id)}
                                                    />
                                                ) : (
                                                    cell.column.columnDef.meta?.fieldVariant === 'date' 
                                                        ? formatDate(cell.getValue() as string)
                                                        : flexRender(cell.column.columnDef.cell, cell.getContext())
                                                )}
                                            </TableCell>
                                        ))}
                                        {columns.some((column) => column.meta?.editable) && (
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleItemEdit(row)}
                                                >
                                                    {rowInEditId === row.id ? <Save/> : <PenIcon/>}
                                                </Button>
                                            </TableCell>
                                        )}
                                        {itemRemovable && (
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleItemRemove(row.original)}
                                                >
                                                    <Trash2/>
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={!itemRemovable ? columns.length : columns.length + 1}
                                               className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table}/>
        </div>
    );
}

