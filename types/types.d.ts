import {RowData} from "@tanstack/table-core";

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select' | 'dateRange',
        filterPlaceholder?: string,
        filterOptions?: string[],
        fieldVariant?: 'text' | 'number' | 'select' | 'date',
        editable?: boolean,
        sortable?: boolean
    }
}
export type ActionResult = {
    success: boolean,
    message?: string
}