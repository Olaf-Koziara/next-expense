"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    ColumnSort,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    Row,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import {ArrowLeftCircleIcon, ArrowRightCircleIcon, Loader2, PenIcon, Save, Trash2} from "lucide-react";
import React, {useEffect, useMemo, useState} from "react";
import DataTableFilter from "@/components/DataTable/DataTableFilter";
import {ColumnFilter} from "@tanstack/table-core";
import {ResponseWithArray, Service} from "@/types/Service";
import DataTableEditField from "@/components/DataTable/DataTableEditField";
import {generateFilterObject} from "@/components/DataTable/utils";
import DataTableHeader from "@/components/DataTable/DataTableHeader";
import useStatus from "@/hooks/useStatus";
import {cn} from "@/lib/utils";
import {useCurrencies} from "@/hooks/useCurrencies";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";


export type SortFilterState = (ColumnSort | ColumnFilter)[];

type Props<TData, TValue> = {
    onSortingChange?: (data: SortFilterState) => void,
    onFilterChange?: (data: SortFilterState) => void,
    itemRemovable?: boolean,
    onItemRemove?: (removedItem: TData) => void,
    onItemEdit?: (editedItem: TData) => void,
    service?: Service<TData>,
    dataParentId?: string | null,
    columns: ColumnDef<TData, TValue>[],
    data?: TData[],
    manualSorting?: boolean,
    manualFiltering?: boolean,
    manualPagination?: boolean,
    triggerFetch?: boolean,
    defaultCurrency?: string,
    onFetch?: (data: TData[]) => void;
}

export function DataTable<TData extends { _id: string }, TValue extends NonNullable<TData>>({
                                                                                                columns,
                                                                                                data,
                                                                                                onSortingChange,
                                                                                                onFilterChange,
                                                                                                onItemEdit,
                                                                                                itemRemovable = false,
                                                                                                onItemRemove,
                                                                                                service,
                                                                                                dataParentId,
                                                                                                manualFiltering = false,
                                                                                                manualSorting = false,
                                                                                                manualPagination = false,
                                                                                                triggerFetch = false,
                                                                                                defaultCurrency = 'USD',
                                                                                                onFetch
                                                                                            }: Props<TData, TValue>) {
    const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 10});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [tableData, setTableData] = useState<TData[]>(data || []);
    const [rowInEditId, setRowEditId] = useState<string | null>(null);
    const [rowInEdit, setRowInEdit] = useState<TData>();
    const [pageCount, setPageCount] = useState(0);
    const {currencies} = useCurrencies();

    const {setStatus, isLoading} = useStatus();

    const pageSizeOptions = [5, 10, 15, 20];

    useEffect(() => {
        if (!data) {
            fetchData();
        }
        if (onSortingChange) {
            onSortingChange(sorting);
        }
        if (onFilterChange) {
            onFilterChange(columnFilters);
        }
    }, [service, dataParentId, sorting, columnFilters, pagination, triggerFetch]);
    useEffect(() => {
        setPagination({pageIndex: 0, pageSize: 10});
    }, [columnFilters]);

    useEffect(() => {
        if (data) {
            setTableData(data);
        }
    }, [data]);
    const filter = useMemo(() => generateFilterObject(columnFilters, sorting, pagination), [columnFilters, sorting, pagination]);

    const table = useReactTable({
        data: tableData||[],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        manualSorting,
        manualFiltering,
        manualPagination,
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
    const fetchData = async () => {
        if (service) {
            if (!tableData || tableData.length === 0) {
                setStatus('pending');
            }

            let response: ResponseWithArray<TData> = {data: [], totalCount: 0};

            if (dataParentId) {
                response = await service.getAll(filter, dataParentId);
            } else {
                if (dataParentId !== null) {
                    response = (await service.getAll(filter));
                }
            }
            setTableData(response.data)

            setPageCount(Math.ceil(response.totalCount / pagination.pageSize))
            setStatus('success');
            onFetch?.(response.data);
        }
    };
    const handlePageSizeChange = (size: number) => {
        setPagination({...pagination, pageSize: size});
    }
    const handleItemEdit = async (row: Row<TData>) => {
        setRowEditId(row.id);
        setRowInEdit(row.original);

        if (rowInEditId === row.id && rowInEdit) {
            const updatedData = tableData.map((item, index) =>
                index.toString() === row.id ? rowInEdit : item
            );
            setTableData(updatedData);
            if (onItemEdit) {
                onItemEdit(rowInEdit);
            }
            setRowEditId(null);
            setRowInEdit(undefined);

            if (service) {
                setStatus('pending');
                if (dataParentId) {
                    await service.patch(rowInEdit, dataParentId).catch(() => setStatus('error'));
                } else {
                    await service.patch(rowInEdit).catch(() => setStatus('error'));
                }
                setStatus('success');
            }
        }
    };
    const handleItemInputChange = (value: TValue, columnId: string) => {
        setRowInEdit((prev) =>
            prev
                ? {
                    ...prev,
                    [columnId]: value,
                }
                : undefined
        );
    };

    const handleItemRemove = async (item: TData) => {
        const updatedData = tableData.filter((data) => data !== item);
        setTableData(updatedData);
        if (service) {
            if (dataParentId) {
                await service.remove((item)._id, dataParentId);
            } else {
                await service.remove((item)._id,);
            }
        }
        if (onItemRemove) {
            onItemRemove(item);
        }
    };

    const formatCurrency = (value: number, currencyCode: string) => {
        const currency = currencies.find(c => c.currencyCode === currencyCode) || { currencyCode: defaultCurrency, name: 'US Dollar' };
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.currencyCode,
        }).format(value);
    };

    return (
        <div className="space-y-4">
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

                            tableData &&tableData.length > 0 ? (
                                table.getRowModel().rows.map((row, index) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {rowInEditId === row.id ? (
                                                    <DataTableEditField
                                                        column={cell.column}
                                                        value={rowInEdit?.[cell.column.id as keyof TData] as TValue}
                                                        onChange={(value) => handleItemInputChange(value, cell.column.id)}
                                                    />
                                                ) : (
                                                    flexRender(cell.column.columnDef.cell, cell.getContext())
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

