import React, {forwardRef, useEffect, useState} from 'react';
import {Calendar} from "@/components/ui/calendar";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {SyntheticEvent} from "@/types/Event";
import {DateRange} from "react-day-picker";

type BaseCalendarInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

interface SingleCalendarInputProps extends BaseCalendarInputProps {
    mode: 'single';
    value?: Date | string;
    onChange?: (event: SyntheticEvent) => void;
}

interface RangeCalendarInputProps extends BaseCalendarInputProps {
    mode: 'range';
    value?: DateRange | string;
    onChange?: (event: SyntheticEvent) => void;
}

interface MultipleCalendarInputProps extends BaseCalendarInputProps {
    mode: 'multiple';
    value?: Date[] | string;
    onChange?: (event: SyntheticEvent) => void;
}

type CalendarInputProps = SingleCalendarInputProps | RangeCalendarInputProps | MultipleCalendarInputProps;

const CalendarInput = forwardRef<HTMLInputElement, CalendarInputProps>(({
                                                                            value,
                                                                            onChange,
                                                                            mode,
                                                                            ...props
                                                                        }, ref) => {
    const [dateValue, setDateValue] = useState<Date | DateRange | Date[] | undefined>();

    const handleDateSelect = (date: Date | DateRange | Date[] | undefined) => {
        setDateValue(date);
        if (onChange) {
            const syntheticEvent: SyntheticEvent = {
                target: {
                    value: date ? dateToString(date) : '',
                    name: props.name
                },
                type: 'change'
            };
            onChange(syntheticEvent);
        }
    };
    const dateToString = (date: Date | DateRange | Date[]) => {
        if (Array.isArray(date))
            return date.map(d => d.toISOString()).join(',')
        if (date instanceof Date)
            return date.toISOString()
        if (date.to) {
            return `${date.from?.toISOString()},${date.to.toISOString()}`

        }
        return `${date.from?.toISOString()}}`

    }

    const getDisplayValue = () => {
        if (!dateValue) return <span>Pick a date</span>;

        if (dateValue instanceof Date) {
            return format(dateValue, "PPP");
        }

        if (Array.isArray(dateValue)) {
            return `${dateValue.length} dates selected`;
        }

        return dateValue.from
            ? `${format(dateValue.from, "PPP")} - ${dateValue.to ? format(dateValue.to, "PPP") : "..."}`
            : "Pick a date range";
    };

    return (
        <div className="relative">
            <input
                type="hidden"
                ref={ref}
                value={dateValue ? dateToString(dateValue) : ''}
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
});


export default CalendarInput;