"use client";
import React from "react";
import { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Button } from "../ui/button";
import { RefreshCcwDot } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-end">
      <div className="flex gap-2">
        <Button onClick={() => table.resetColumnFilters(true)}>
          <RefreshCcwDot />
          Clear filters
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
