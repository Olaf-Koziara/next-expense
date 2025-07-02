"use client";
import React from "react";
import { AccessorKeyColumnDef, Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Button } from "../ui/button";
import { RefreshCcwDot } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import DataTableFilter from "./DataTableFilter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  columns: ColumnDef<TData, unknown>[];
}

export function DataTableToolbar<TData>({
  table,
  columns,
}: DataTableToolbarProps<TData>) {
  const filterableColumns = columns.filter((col) => {
    const meta = col.meta as { filterable?: boolean } | undefined;
    const accessorKey = (col as AccessorKeyColumnDef<TData>).accessorKey as
      | string
      | undefined;
    return (
      meta?.filterable &&
      accessorKey &&
      table.getColumn(accessorKey)?.getCanFilter()
    );
  });
  return (
    <div className="flex flex-row justify-between gap-2 py-2">
      <div className="flex flex-row flex-wrap gap-2 overflow-x-auto">
        {filterableColumns.length > 0 &&
          filterableColumns.map((col) => {
            const accessorKey = (col as AccessorKeyColumnDef<TData>)
              .accessorKey as string | undefined;
            if (!accessorKey) return null;
            const columnInstance = table.getColumn(accessorKey);
            if (!columnInstance) return null;
            return (
              <div key={accessorKey} className="min-w-[120px]">
                <DataTableFilter column={columnInstance} />
              </div>
            );
          })}
      </div>
      <div className="flex items-center justify-end gap-2">
        {filterableColumns.length > 0 && (
          <Button onClick={() => table.resetColumnFilters(true)}>
            <RefreshCcwDot />
            Clear filters
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
