import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import Datepicker from "@/components/ui/datepicker";
import {SyntheticEvent} from "@/types/Event";
import {DateRange} from "react-day-picker";
import {oneMonthAgo, oneWeekAgo, oneYearAgo, sixMonthsAgo, threeMonthsAgo} from "@/utils/date";

const now = new Date();
type Props = {
    onChange: (dateRange: DateRange) => void;
}
export type StatisticsFilterValue = DateRange;
const StatisticsFilter = ({onChange}: Props) => {
    const [dateRange, setDateRange] = useState<StatisticsFilterValue>({from: oneMonthAgo, to: now});
    useEffect(() => {
        onChange(dateRange);
    }, [dateRange, onChange]);
    const handleDateRangeChange = (e: SyntheticEvent<DateRange | string>) => {
        setDateRange(e.target.value as DateRange);
    }
    const setDateRangeFromDateToNow = (date: Date) => {
        setDateRange({from: date, to: now});
    }
    return (
        <div>
            <div className='flex justify-center'><Button variant={'ghost'}
                                                         onClick={() => setDateRangeFromDateToNow(oneWeekAgo)}>1W</Button>
                <Button variant={'ghost'} onClick={() => setDateRangeFromDateToNow(oneMonthAgo)}>1M</Button>
                <Button variant={'ghost'} onClick={() => setDateRangeFromDateToNow(threeMonthsAgo)}>3M</Button>
                <Button variant={'ghost'} onClick={() => setDateRangeFromDateToNow(sixMonthsAgo)}>6M</Button>
                <Button variant={'ghost'} onClick={() => setDateRangeFromDateToNow(oneYearAgo)}>1Y</Button>

            </div>

            <div className='flex justify-center'>
                <Datepicker mode={'range'} value={dateRange} onChange={handleDateRangeChange}/>
            </div>
        </div>
    );
};

export default StatisticsFilter;