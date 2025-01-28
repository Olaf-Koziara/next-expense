import {RowData} from "@tanstack/table-core";

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select' | 'dateRange',
        filterPlaceholder?: string,
        filterOptions?: string[],
        fieldVariant?: 'text' | 'number' | 'select' | 'dateRange',
        editable?: boolean
    }
}