import {DateRange} from "react-day-picker";
import {format} from "date-fns";

export const dateRangeValuesToString = (dateRange: DateRange) => {
    if (!dateRange.from) return {dateFrom: '', dateTo: ''}
    return {
        dateFrom: format(dateRange.from, 'yyyy-MM-dd'),
        dateTo: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''
    }
}