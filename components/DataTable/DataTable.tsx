"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, PenIcon, Save, Trash2 } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { Service } from "@/types/Service";
import DataTableEditField from "@/components/DataTable/DataTableEditField";
import DataTableHeader from "@/components/DataTable/DataTableHeader";
import { DataTablePagination } from "@/components/DataTable/DataTablePagination";
import { DataTableToolbar } from "@/components/DataTable/DataTableToolbar";
import { useDataTable } from "./hooks/useDataTable";
import { useRowEdit } from "./hooks/useRowEdit";
import { useItemRemove } from "./hooks/useItemRemove";
import { DataTableForm } from "./DataTableForm";
import { Schema } from "./types";
import { formatDate } from "@/utils/date";

export interface DataTableContextFunctions<TData> {
  setData?: (data: TData[]) => void;
  setFilters?: (filters: { id: string; value: unknown }[]) => void;
  setSorting?: (sorting: { id: string; desc: boolean }[]) => void;
  setPagination?: (pagination: { pageIndex: number; pageSize: number }) => void;
  onDataChange?: (data: TData[]) => void;
  onSortingChange?: (sorting: { id: string; desc: boolean }[]) => void;
  onFiltersChange?: (filters: { id: string; value: unknown }[]) => void;
  onPaginationChange?: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
}

interface DataTableProps<TData> {
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
  onPaginationChange?: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  setData?: (data: TData[]) => void;
  setFilters?: (filters: { id: string; value: unknown }[]) => void;
  setSorting?: (sorting: { id: string; desc: boolean }[]) => void;
  setPagination?: (pagination: { pageIndex: number; pageSize: number }) => void;
  useContextHook?: () => Partial<DataTableContextFunctions<TData>>;
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
  onDataChange: onDataChangeProp,
  onSortingChange: onSortingChangeProp,
  onFiltersChange: onFiltersChangeProp,
  onPaginationChange: onPaginationChangeProp,
  setData: setDataProp,
  setFilters: setFiltersProp,
  setSorting: setSortingProp,
  setPagination: setPaginationProp,
  useContextHook,
}: DataTableProps<TData>) {
  const contextFns: Partial<DataTableContextFunctions<TData>> = (
    useContextHook ?? (() => ({} as Partial<DataTableContextFunctions<TData>>))
  )();
  const setData = setDataProp ?? contextFns.setData;
  const setFilters = setFiltersProp ?? contextFns.setFilters;
  const setSorting = setSortingProp ?? contextFns.setSorting;
  const setPagination = setPaginationProp ?? contextFns.setPagination;
  const onDataChange = onDataChangeProp ?? contextFns.onDataChange;
  const onSortingChange = onSortingChangeProp ?? contextFns.onSortingChange;
  const onFiltersChange = onFiltersChangeProp ?? contextFns.onFiltersChange;
  const onPaginationChange =
    onPaginationChangeProp ?? contextFns.onPaginationChange;

  const {
    data,
    pageCount,
    isLoading,
    pagination,
    setPagination: setPaginationState,
    sorting,
    setSorting: setSortingState,
    columnFilters,
    setColumnFilters: setColumnFiltersState,
    fetchData,
  } = useDataTable(service, dataParentId, {
    initialData,
    initialSorting,
    initialFilters,
    initialPageSize,
  });

  useEffect(() => {
    if (!onFetchData && !onDataChange && !setData) return;
    if (onFetchData) onFetchData(data);
    if (onDataChange) onDataChange(data);
    if (setData) setData(data);
  }, [isLoading, data, onDataChange, onFetchData, setData]);

  useEffect(() => {
    if (!onSortingChange && !setSorting) return;
    if (onSortingChange) onSortingChange(sorting);
    if (setSorting) setSorting(sorting);
  }, [sorting, onSortingChange, setSorting]);

  useEffect(() => {
    pagination.pageIndex = 0;
    if (!onFiltersChange && !setFilters) return;
    if (onFiltersChange) onFiltersChange(columnFilters);
    if (setFilters) setFilters(columnFilters);
  }, [columnFilters, onFiltersChange, setFilters]);

  useEffect(() => {
    if (!onPaginationChange && !setPagination) return;
    if (onPaginationChange) onPaginationChange(pagination);
    if (setPagination) setPagination(pagination);
  }, [pagination, onPaginationChange, setPagination]);

  const { rowInEditId, rowInEdit, handleItemEdit, handleItemInputChange } =
    useRowEdit(service, dataParentId, fetchData);

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
        filterable: field.filterable,
      },
    })) as ColumnDef<TData, unknown>[];
  }, [schema]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPaginationState,
    onSortingChange: setSortingState,
    onColumnFiltersChange: setColumnFiltersState,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    pageCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility: {
        _id: false,
      },
    },
  });

  if (!table) return null;

  return (
    <div className="relative w-full max-w-full">
      {form && (
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border rounded-t-xl shadow-sm">
          <DataTableForm
            service={service}
            schema={schema}
            dataParentId={dataParentId}
            onSuccess={fetchData}
          />
        </div>
      )}
      <div className="space-y-4 w-full max-w-full overflow-x-auto">
        <DataTableToolbar table={table} columns={columns} />
        <div className="rounded-xl border border-border overflow-x-auto bg-background shadow-md">
          <Table className="min-w-[600px]">
            <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className="py-4 px-4 text-base font-semibold text-foreground/90 tracking-wide whitespace-nowrap"
                      key={header.id}
                    >
                      <DataTableHeader header={header} />
                    </TableHead>
                  ))}
                  {columns.some((column) => column.meta?.editable) && (
                    <TableHead className="px-4 text-base font-semibold text-foreground/90">
                      Edit
                    </TableHead>
                  )}
                  {itemRemovable && (
                    <TableHead className="px-4 text-base font-semibold text-foreground/90">
                      Remove
                    </TableHead>
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="transition-colors hover:bg-accent/60 focus-within:bg-accent/70 group rounded-lg"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3 align-middle text-foreground/90 text-sm whitespace-nowrap"
                      >
                        {rowInEditId === row.id ? (
                          <DataTableEditField
                            column={cell.column}
                            value={rowInEdit?.[cell.column.id as keyof TData]}
                            onChange={(value) =>
                              handleItemInputChange(
                                value as TData[keyof TData],
                                cell.column.id
                              )
                            }
                          />
                        ) : cell.column.columnDef.meta?.fieldVariant ===
                          "date" ? (
                          formatDate(cell.getValue() as string)
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </TableCell>
                    ))}
                    {columns.some((column) => column.meta?.editable) && (
                      <TableCell className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full transition-colors hover:bg-primary/10 focus:bg-primary/20"
                          onClick={() => handleItemEdit(row)}
                        >
                          {rowInEditId === row.id ? (
                            <Save className="text-primary" />
                          ) : (
                            <PenIcon className="text-muted-foreground group-hover:text-primary" />
                          )}
                        </Button>
                      </TableCell>
                    )}
                    {itemRemovable && (
                      <TableCell className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full transition-colors hover:bg-destructive/10 focus:bg-destructive/20"
                          onClick={() => handleItemRemove(row.original)}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      !itemRemovable ? columns.length : columns.length + 1
                    }
                    className="h-24 text-center text-muted-foreground bg-background/80"
                  >
                    {NO_RESULTS_TEXT}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="pt-4">
        {}
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}

const NO_RESULTS_TEXT = "No results.";
