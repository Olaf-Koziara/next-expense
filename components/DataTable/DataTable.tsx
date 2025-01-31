"use client"

import {
    Cell,
    ColumnDef,
    ColumnFiltersState,
    ColumnSort,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Header,
    PaginationState,
    Row,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import {
    ArrowDown,
    ArrowLeftCircleIcon,
    ArrowRightCircleIcon,
    ArrowUp,
    ArrowUpDown, Loader2,
    PenIcon,
    Save,
    Trash2
} from "lucide-react";
import React, {useEffect, useMemo, useState} from "react";
import DataTableFilter from "@/components/DataTable/DataTableFilter";
import {Column, ColumnFilter, RowData} from "@tanstack/table-core";
import {Service} from "@/types/Service";
import DataTableEditField from "@/components/DataTable/DataTableEditField";
import {generateFilterObject} from "@/components/DataTable/utils";
import DataTableHeader from "@/components/DataTable/DataTableHeader";
import useStatus from "@/hooks/useStatus";


export type SortFilterState = (ColumnSort | ColumnFilter)[];

type Props<TData, TValue> = {
    onSortingChange?: (data: SortFilterState) => void,
    onFilterChange?: (data: SortFilterState) => void,
    itemRemovable?: boolean,
    onItemRemove?: (removedItem: TData) => void,
    onItemEdit?: (editedItem: TData) => void,
    service?: Service<TData>,
    dataParentId?: string | null,
    columns: ColumnDef<TData, TValue>[]
    data?: TData[]
    manualSorting?: boolean,
    manualFiltering?: boolean,
    triggerFetch?: boolean

}


export function DataTable<TData, TValue extends NonNullable<TData>>({
                                                                        columns,
                                                                        data,
                                                                        onSortingChange,
                                                                        onFilterChange,
                                                                        onItemEdit,
                                                                        itemRemovable = false,
                                                                        onItemRemove,
                                                                        service,
                                                                        dataParentId,
                                                                        manualFiltering = false, manualSorting = false,
                                                                        triggerFetch = false, ...rest// Parent ID for fetching
                                                                    }: Props<TData, TValue>) {
    const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 10});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [tableData, setTableData] = useState<TData[]>(data || []);
    const [rowInEditId, setRowEditId] = useState<string | null>(null);
    const [rowInEdit, setRowInEdit] = useState<TData>();

    const {isLoading, startLoading, stopLoading, setErrorState, resetError} = useStatus();

    const pageSizeOptions = [5, 10, 15, 20];

    useEffect(() => {
        fetchData();
    }, [service, dataParentId, sorting, columnFilters, triggerFetch]);

    useEffect(() => {
        if (data) {
            setTableData(data);
        }
    }, [data]);
    const filter = useMemo(() => generateFilterObject(columnFilters, sorting, pagination), [columnFilters, sorting, pagination]);


    const table = useReactTable({
        data: tableData,
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
                startLoading();
            }
            let result: TData[] = [];

            if (dataParentId) {
                result = await service.getAll(filter, dataParentId);
            } else {
                if (dataParentId !== null) {
                    result = await service.getAll(filter);
                }
            }
            setTableData(result)
            stopLoading();

        }

    };
    const handlePageSizeChange = (size: number) => {
        setPagination({...pagination, pageSize: size});
        fetchData()
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
                startLoading();
                if (dataParentId) {
                    await service.patch(rowInEdit, dataParentId);
                } else {
                    await service.patch(rowInEdit);
                }
                stopLoading();
            }

        }
    };
    const handleItemInputChange =
        (value: TValue, columnId: string) =>
            setRowInEdit((prev) =>
                prev
                    ? {
                        ...prev,
                        [columnId as keyof TData]: value,
                    }
                    : undefined
            )

    const handleItemRemove = async (item: TData) => {
        const updatedData = tableData.filter((data) => data !== item);
        setTableData(updatedData);
        if (service) {
            startLoading();
            if (dataParentId) {
                await service.remove((item as any)._id, dataParentId);
            } else {
                await service.remove((item as any)._id,);
            }
            stopLoading();
        }
        if (onItemRemove) {
            onItemRemove(item);
        }
    };

    return (
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

                        table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {cell.column.columnDef.meta?.editable && rowInEditId === row.id ? (
                                                <DataTableEditField column={cell.column} value={rowInEdit
                                                    ? rowInEdit[cell.column.id as keyof TData]
                                                    : (row.original as any)[cell.column.id]}
                                                                    onChange={(value) => handleItemInputChange(value, cell.column.id)
                                                                    }/>
                                            ) : (
                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                            )}
                                        </TableCell>
                                    ))}
                                    {columns.some((column) => column.meta?.editable) && (
                                        <TableCell>
                                            {rowInEditId !== row.id ? (
                                                <Button onClick={() => handleItemEdit(row)}>
                                                    <PenIcon/>
                                                </Button>
                                            ) : (
                                                <Button onClick={() => handleItemEdit(row)}>
                                                    <Save/>
                                                </Button>
                                            )}
                                        </TableCell>
                                    )}
                                    {itemRemovable && (
                                        <TableCell>
                                            <Button onClick={() => handleItemRemove(row.original)}>
                                                <Trash2/>
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
            {data && data.length > pagination.pageSize && <div className="flex justify-between w-full px-2 py-1">
                <Button size={"sm"} onClick={table.previousPage}>
                    <ArrowLeftCircleIcon/>
                </Button>
                <div className="flex gap-1 items-center">
                    <span>{`${pagination.pageIndex + 1} / ${table.getPageCount()}`}</span>
                    <select
                        value={pagination.pageSize}
                        onChange={(e) => handlePageSizeChange(parseInt(e.currentTarget.value))}
                    >
                        {pageSizeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <Button size={"sm"} onClick={table.nextPage}>
                    <ArrowRightCircleIcon/>
                </Button>
            </div>}
        </div>
    );
}

