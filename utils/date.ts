import {DateRange} from "react-day-picker";
import {format} from "date-fns";

export const now = new Date();
export const oneYearAgo = new Date();
oneYearAgo.setFullYear(now.getFullYear() - 1);
export const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(now.getMonth() - 6);
export const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(now.getMonth() - 3);
export const oneMonthAgo = new Date();
oneMonthAgo.setMonth(now.getMonth() - 1);
export const oneWeekAgo = new Date();
oneWeekAgo.setDate(now.getDate() - 7);

export const dateRangeValuesToString = (dateRange: DateRange) => {
    if (!dateRange.from) return {dateFrom: '', dateTo: ''}
    return {
        dateFrom: format(dateRange.from, 'yyyy-MM-dd'),
        dateTo: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''
    }
}
export const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};