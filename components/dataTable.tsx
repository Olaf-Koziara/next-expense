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
import {ArrowLeftCircleIcon, ArrowRightCircleIcon, PenIcon, Save, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import DataTableFilter from "@/components/dataTableFilter";
import {ColumnFilter, RowData} from "@tanstack/table-core";
import {Service} from "@/types/Service";
import {QueryParams} from "@/app/services/api";
import DataTableEditField from "@/components/dataTableEditField";

export type SortFilterState = (ColumnSort | ColumnFilter)[];

type Props<TData, TValue> = {
    onSortingChange?: (data: SortFilterState) => void,
    onFilterChange?: (data: SortFilterState) => void,
    itemRemovable?: boolean,
    onItemRemove?: (removedItem: TData) => void,
    onItemEdit?: (editedItem: TData) => void,
    service?: Service<TData>,
    dataParentId?: string,
    columns: ColumnDef<TData, TValue>[]
    data?: TData[]
}

export function DataTable<TData, TValue extends NonNullable<TData>>({
                                                                        columns,
                                                                        data,
                                                                        onSortingChange,
                                                                        onFilterChange,
                                                                        itemRemovable = false,
                                                                        onItemRemove,
                                                                        service,
                                                                        dataParentId, // Parent ID for fetching
                                                                    }: Props<TData, TValue>) {
    const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 10});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [tableData, setTableData] = useState<TData[]>(data || []);
    const [rowInEditId, setRowEditId] = useState<string | null>(null);
    const [rowInEdit, setRowInEdit] = useState<TData>(); // Local state for managing edits
    const pageSizeOptions = [5, 10, 15, 20];

    // Fetch data when `parentId` or table state changes
    useEffect(() => {
        fetchData();
    }, [service, dataParentId, sorting, columnFilters]);

    useEffect(() => {
        if (data) {
            setTableData(data);
        }
    }, [data]);


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
        manualSorting: !!onSortingChange,
        manualFiltering: !!onFilterChange,
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
        const filter = generateFilterObject(columnFilters, sorting, pagination);
        if (service && dataParentId) {
            const result = await service.getAll(filter, dataParentId);
            setTableData(result)
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
            setRowEditId(null);
            setRowInEdit(undefined);

            if (service) {
                if (dataParentId) {
                    await service.patch(rowInEdit, dataParentId);
                } else {
                    await service.patch(rowInEdit);
                }
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

        if (onItemRemove) {
            onItemRemove(item);
        }

        if (service && dataParentId) {
            await service.remove((item as any)._id, dataParentId);
        }
    };
    const generateFilterObject = (columnFilter: ColumnFiltersState, sortingState: SortingState, paginationState: PaginationState) => {
        let filterObject: QueryParams = {};
        for (let x = 0; x < columnFilter.length; x++) {
            const item = columnFilter[x];
            const key = columnFilter[x].id;
            const value = String(item.value)
            if (value.includes(',')) {
                const splittedValue = value.split(',');
                filterObject[`${key}Start`] = splittedValue[0];
                if (splittedValue[1]) {
                    filterObject[`${key}End`] = splittedValue[1];
                }
            }
        }
        for (let x = 0; x < sortingState.length; x++) {
            const item = sortingState[x];
            filterObject['sortBy'] = item.id;
            filterObject['sortOrder'] = item.desc ? 'desc' : 'asc'
        }
        filterObject['pageIndex'] = paginationState.pageIndex.toString();
        filterObject['pageSize'] = paginationState.pageSize.toString();
        return filterObject;

    }

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
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                            {columns.some((column) => column.meta?.editable) && (
                                <TableHead>Edit</TableHead>
                            )}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
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
            <div className="flex justify-between w-full px-2 py-1">
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
            </div>
        </div>
    );
}

