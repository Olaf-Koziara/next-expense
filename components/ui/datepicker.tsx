import React, { forwardRef, useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SyntheticEvent } from "@/types/Event";
import { DateRange } from "react-day-picker";
import { FieldError } from "react-hook-form";

type BaseCalendarInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>;

interface SingleCalendarInputProps extends BaseCalendarInputProps {
  mode: "single";
  value?: Date | string;
  onChange?: (event: SyntheticEvent<Date | string>) => void;
}

interface RangeCalendarInputProps extends BaseCalendarInputProps {
  mode: "range";
  value?: DateRange | string;
  onChange?: (event: SyntheticEvent<DateRange | string>) => void;
}

interface MultipleCalendarInputProps extends BaseCalendarInputProps {
  mode: "multiple";
  value?: Date[] | string;
  onChange?: (event: SyntheticEvent<Date[] | string>) => void;
}

type CalendarInputProps = (
  | SingleCalendarInputProps
  | RangeCalendarInputProps
  | MultipleCalendarInputProps
) & {
  dateFormat?: string;
  formatValueToString?: boolean;
  error?: FieldError;
};
type CalendarInputValue = Date | DateRange | Date[] | undefined;

const CalendarInput = forwardRef<HTMLInputElement, CalendarInputProps>(
  (
    {
      value,
      onChange,
      mode,
      formatValueToString,
      dateFormat = "PPP",
      ...props
    },
    ref
  ) => {
    const [dateValue, setDateValue] = useState<CalendarInputValue>();
    useEffect(() => {
      if (typeof value === "string") {
        if (value) {
          setDateValue(stringToDateValue(value));
        }
      } else {
        setDateValue(value);
      }
    }, [value]);
    const handleDateSelect = (date: CalendarInputValue) => {
      setDateValue(date);
      if (onChange && date) {
        const eventValue = formatValueToString ? dateValueToString(date) : date;
        if (mode === "single") {
          onChange({
            target: {
              value: eventValue as Date | string,
              name: props.name,
            },
            type: "change",
          });
        } else if (mode === "range") {
          onChange({
            target: {
              value: eventValue as DateRange | string,
              name: props.name,
            },
            type: "change",
          });
        } else {
          onChange({
            target: {
              value: eventValue as Date[] | string,
              name: props.name,
            },
            type: "change",
          });
        }
      }
    };
    const dateValueToString = (dateValue: CalendarInputValue) => {
      if (!dateValue) return "";
      if (Array.isArray(dateValue))
        return dateValue.map((d) => d.toISOString()).join(",");
      if (dateValue instanceof Date) return dateValue.toISOString();
      if (dateValue.to) {
        return `${dateValue.from?.toISOString()},${dateValue.to.toISOString()}`;
      }
      return `${dateValue.from?.toISOString()}}`;
    };
    const stringToDateValue = (value: string) => {
      if (!value) return undefined;
      if (Array.isArray(value)) return value.map((date) => new Date(date));
      if (value.includes(",")) {
        const [from, to] = value.split(",");
        return { from: new Date(from), to: to ? new Date(to) : undefined };
      }
      return new Date(value);
    };

    const getDisplayValue = () => {
      if (!dateValue) return <span>Pick a date</span>;

      if (dateValue instanceof Date) {
        return format(dateValue, dateFormat);
      }

      if (Array.isArray(dateValue)) {
        return `${dateValue.length} dates selected`;
      }

      return dateValue.from
        ? `${format(dateValue.from, dateFormat)} - ${
            dateValue.to ? format(dateValue.to, dateFormat) : "..."
          }`
        : "Pick a date range";
    };

    return (
      <div className="relative">
        <input
          type="hidden"
          ref={ref}
          value={dateValue ? dateValueToString(dateValue) : ""}
          {...props}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !dateValue && "text-muted-foreground"
              )}
            >
              {getDisplayValue()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode={mode}
              selected={dateValue}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
CalendarInput.displayName = "CalendarInput";

export default CalendarInput;
