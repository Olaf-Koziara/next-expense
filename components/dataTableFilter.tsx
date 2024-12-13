import {Column} from "@tanstack/table-core";
import DebouncedInput from "@/components/ui/debouncedInput";
import {Expense} from "@/app/(root)/expenses/columns";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

function DataTableFilter({column}: { column: Column<Expense> }) {
    const columnFilterValue = column.getFilterValue()
    const {filterVariant, filterOptions, filterPlaceholder} = column.columnDef.meta ?? {}

    return filterVariant === 'range' ? (
        <div>
            <div className="flex space-x-2">
                {/* See faceted column filters example for min max values functionality */}
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Min`}
                    className="w-24 border shadow rounded"
                />
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Max`}
                    className="w-24 border shadow rounded"
                />
            </div>
            <div className="h-1"/>
        </div>
    ) : filterVariant === 'select' && filterOptions ? (
        <Select
            onValueChange={column.setFilterValue}
            value={columnFilterValue?.toString()}
        >
            <SelectTrigger>
                <SelectValue placeholder={filterPlaceholder}></SelectValue> </SelectTrigger>
            <SelectContent>
                {/*<SelectItem value=''>All</SelectItem>*/}
                {filterOptions.map((option, index) => <SelectItem key={index}
                                                                  value={option.title}>{option.title}</SelectItem>)}
            </SelectContent>
        </Select>
    ) : (
        <DebouncedInput
            className="w-36 border shadow rounded"
            onChange={value => column.setFilterValue(value)}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '') as string}
        />
        // See faceted column filters example for datalist search suggestions
    )
}

export default DataTableFilter;