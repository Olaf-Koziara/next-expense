"use client"

import {
    ColumnDef, ColumnFiltersState,
    flexRender,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, Header, SortingState,
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
import {ArrowLeftCircleIcon, ArrowRightCircleIcon} from "lucide-react";
import {useState} from "react";
import DataTableFilter from "@/components/dataTableFilter";
import {Expense} from "@/app/(root)/expenses/columns";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                         }: DataTableProps<TData, TValue>) {
    const [pagination,setPagination] = useState({pageIndex:0,pageSize:10});
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const pageSizeOptions = [5,10,15,20];
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel:getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel:getFilteredRowModel(),
        onPaginationChange:setPagination,
        onSortingChange:setSorting,
        onColumnFiltersChange:setColumnFilters,
        state:{
            pagination,
            sorting,
            columnFilters
        },
    })

    const handlePageSizeChange =(size:number)=>setPagination({...pagination,pageSize: size});
    return (
        <div className="rounded-md border">
            <div>

            </div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.column.getCanFilter() ? (
                                            <div>
                                                <DataTableFilter column={header.column} />
                                            </div>
                                        ) : null}
                                    {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}

                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}

                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
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
            <div className='flex justify-between w-full px-2 py-1'>
                <Button size={'sm'} onClick={table.previousPage}><ArrowLeftCircleIcon/></Button>
               <div className='flex gap-1 items-center'>
                   <span>{`${pagination.pageIndex+1} / ${table.getPageCount()}`}</span>
                   <select value={pagination.pageSize} onChange={(e)=>handlePageSizeChange(parseInt(e.currentTarget.value))}>
                       {pageSizeOptions.map((option)=><option key={option} value={option}>{option}</option>)}
                   </select>
               </div>
                <Button size={'sm'} onClick={table.nextPage}><ArrowRightCircleIcon/></Button>

            </div>
        </div>
    )
}
