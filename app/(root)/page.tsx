'use client';
import React, {useEffect, useState} from 'react';
import {WalletStats} from "@/types/Stats";
import {useWallet} from "@/context/WalletContext";
import ChartPie from "@/components/charts/Pie";
import {dateRangeValuesToString} from "@/utils/date";
import Area from "@/components/charts/Area";
import {prepareExpenseDataForAreaChart, sumByKeys} from "@/utils/calculate";
import useCategories from "@/hooks/useCategories";
import StatisticsFilter, {StatisticsFilterValue} from "@/app/(root)/(components)/StatisticsFilter";


const Dashboard = () => {
    const {getStatistics, selectedWallet} = useWallet();
    const {categories: expenseCategories} = useCategories({type: 'expense'});
    const {categories: incomeCategories} = useCategories({type: 'income'});
    const [statistics, setStatistics] = useState<WalletStats>();
    const [statisticsFilter, setStatisticsFilter] = useState<StatisticsFilterValue>({from: new Date(), to: new Date()});


    useEffect(() => {
        if (selectedWallet) {
            getStatistics(dateRangeValuesToString(statisticsFilter)).then(data => setStatistics(data))
        }
    }, [selectedWallet, statisticsFilter]);


    return (
        <div>
            <StatisticsFilter onChange={setStatisticsFilter}/>
            {
                statistics &&
                <div className='flex flex-wrap'>
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
                </div>
            }


        </div>
    );
};

export default Dashboard;