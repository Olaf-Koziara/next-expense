'use client';
import React, {useEffect, useState} from 'react';
import {WalletStats} from "@/types/Stats";
import {useWallet} from "@/context/WalletContext";
import ChartPie from "@/components/charts/Pie";
import {dateRangeValuesToString} from "@/utils/date";
import Area from "@/components/charts/Area";
import {prepareExpenseDataForAreaChart} from "@/utils/calculate";
import useCategories from "@/hooks/useCategories";
import StatisticsFilter, {StatisticsFilterValue} from "@/app/(root)/(components)/StatisticsFilter";
import useStatus from "@/hooks/useStatus";
import {LoadingSpinner} from "@/components/ui/loadingSpinner";


const Dashboard = () => {
    const {getStatistics, selectedWallet} = useWallet();
    const {categories: expenseCategories} = useCategories('expense');
    const {categories: incomeCategories} = useCategories('income');
    const [statistics, setStatistics] = useState<WalletStats>();
    const [statisticsFilter, setStatisticsFilter] = useState<StatisticsFilterValue>({from: new Date(), to: new Date()});
    const {setStatus, status} = useStatus()


    useEffect(() => {
        if (selectedWallet) {
            setStatus('pending')
            getStatistics(dateRangeValuesToString(statisticsFilter)).then(data => {
                setStatistics(data)
                setStatus('success');
            }).catch(err => setStatus('error'))
        }
    }, [selectedWallet, statisticsFilter, getStatistics]);


    return (
        <div>
            <StatisticsFilter onChange={setStatisticsFilter}/>
            {
                statistics && status === 'success' ?
                    <div className='flex justify-center items-center flex-wrap'>
                        <div className='w-1/2'><ChartPie chartConfig={{}} dataKey={'total'} nameKey={'category'}
                                                         data={statistics?.summedExpenseCategories} title='Expenses'/>
                        </div>
                        <div className='w-1/2'><ChartPie data={statistics.summedIncomeCategories} dataKey={'total'}
                                                         nameKey={'category'}
                                                         chartConfig={{}} title='Incomes'/></div>
                        <div className='w-1/2'>
                            <Area data={prepareExpenseDataForAreaChart(statistics.summedExpenseCategoriesAndDate)}
                                  dataKeys={['date', ...expenseCategories.map(category => category.name)]}/>
                        </div>
                        <div className='w-1/2'>
                            <Area data={prepareExpenseDataForAreaChart(statistics.summedIncomeCategoriesAndDate)}
                                  dataKeys={['date', ...incomeCategories.map(category => category.name)]}/>
                        </div>
                    </div> :
                    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 '><LoadingSpinner
                        size={128}/></div>
            }


        </div>
    );
};

export default Dashboard;