import React from "react";
import { Column } from "@tanstack/table-core";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CalendarInput from "@/components/ui/datepicker";

type Props<TData, TValue> = {
  column: Column<TData, TValue>;
  value: TValue;
  onChange: (value: TValue) => void;
  placeholder?: string;
};

const DataTableEditField = <TData, TValue>({
  column,
  value,
  onChange,
  placeholder,
}: Props<TData, TValue>) => {
  const { fieldVariant, filterVariant, filterOptions } =
    column.columnDef.meta ?? {};

  switch (fieldVariant || filterVariant) {
    case "text":
      return (
        <Input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value as TValue)}
          placeholder={placeholder}
        />
      );
    case "number":
      return (
        <Input
          type="number"
          value={value as number}
          onChange={(e) => onChange(Number(e.target.value) as TValue)}
        />
      );
    case "select":
      return (
        <Select
          value={value as string}
          onValueChange={(value) => onChange(value as TValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions?.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "date":
      return (
        <CalendarInput
          mode="single"
          dateFormat="yyyy-MM-dd"
          value={value as string}
          onChange={(event) => onChange(event.target.value as TValue)}
        />
      );
    default:
      return (
        <Input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value as TValue)}
        />
      );
  }
};

export default DataTableEditField;
