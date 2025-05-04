import {Column} from "@tanstack/table-core";
import DebouncedInput from "@/components/ui/debouncedInput";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import CalendarInput from "@/components/ui/datepicker";
import {useEffect, useState} from "react";

function DataTableFilter<TData, TValue>({column}: { column: Column<TData, TValue> }) {
    const [filterValue, setFilterValue] = useState(column.getFilterValue())
    useEffect(() => {
        column.setFilterValue(filterValue)
    }, [filterValue]);
    const {filterVariant, filterOptions, filterPlaceholder} = column.columnDef.meta ?? {}

    return filterVariant === 'range' ? (
        <div>
            <div className="flex space-x-2">
                <DebouncedInput
                    type="number"
                    value={(filterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Min`}
                    className="w-24 border shadow rounded"
                />
                <DebouncedInput
                    type="number"
                    value={(filterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Max`}
                    className="w-24 border shadow rounded"
                />
            </div>
            <div className="h-1"/>
        </div>
    ) : filterVariant === 'select' && filterOptions ? (
        <div className='relative'>
            <Select
                defaultValue=''
                onValueChange={setFilterValue}
                value={filterValue as string}
                clearable={true}
            >
                <SelectTrigger className='w-32 relative'>
                    <SelectValue placeholder={filterPlaceholder}/>
                </SelectTrigger>

                <SelectContent>
                    {filterOptions.length > 0 && filterOptions.map((option: string, index: number) => <SelectItem
                        key={index}
                        value={option}>{option}</SelectItem>)}
                </SelectContent>
            </Select>

        </div>
    ) : filterVariant === 'dateRange' ? (
        <div>

            <CalendarInput mode={'range'} onChange={(event) => setFilterValue(event.target.value)}
                           value={filterValue as string}/>
        </div>
    ) : filterVariant === 'text'
        ? (
            <DebouncedInput
                className="w-36 border shadow rounded"
                onChange={value => setFilterValue(value)}
                placeholder={`Search...`}
                type="text"
                value={(filterValue ?? '') as string}
            />
        ) : null
}




   export default DataTableFilter;