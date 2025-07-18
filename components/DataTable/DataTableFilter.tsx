import { Column } from "@tanstack/table-core";
import DebouncedInput from "@/components/ui/debouncedInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CalendarInput from "@/components/ui/datepicker";

function DataTableFilter<TData, TValue>({
  column,
}: {
  column: Column<TData, TValue>;
}) {
  const filterValue = column.getFilterValue();

  const { filterVariant, filterOptions, filterPlaceholder } =
    column.columnDef.meta ?? {};

  return filterVariant === "range" ? (
    <div className="">
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          value={(filterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue([
              value,
              (filterValue as [number, number])?.[1],
            ])
          }
          placeholder={`Min`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          value={(filterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue([
              (filterValue as [number, number])?.[0],
              value,
            ])
          }
          placeholder={`Max`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" && filterOptions ? (
    <div className="relative">
      <Select
        defaultValue=""
        onValueChange={column.setFilterValue}
        value={filterValue as string}
        clearable={true}
      >
        <SelectTrigger className="w-32 relative">
          <SelectValue placeholder={filterPlaceholder} />
        </SelectTrigger>

        <SelectContent>
          {filterOptions.length > 0 &&
            filterOptions.map((option: string, index: number) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  ) : filterVariant === "dateRange" ? (
    <div>
      <CalendarInput
        mode={"range"}
        onChange={(event) => column.setFilterValue(event.target.value)}
        formatValueToString={true}
        value={filterValue as string}
      />
    </div>
  ) : filterVariant === "text" ? (
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={column.setFilterValue}
      placeholder={`Search...`}
      type="text"
      value={(filterValue ?? "") as string}
    />
  ) : null;
}

export default DataTableFilter;
