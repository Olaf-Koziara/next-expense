'use client';
import React, {useEffect, useState} from 'react';
import {Card} from "@/components/ui/card";
import {WalletStats} from "@/types/Stats";
import {useWallet} from "@/context/WalletContext";
import {Pie} from "recharts";
import ChartPie from "@/components/charts/Pie";
import {totalmem} from "node:os";

const Dashboard = () => {
    const {getStatistics, selectedWallet} = useWallet();
    const [statistics, setStatistics] = useState<WalletStats>();
    useEffect(() => {
        if (selectedWallet) {
            getStatistics().then(data => setStatistics(data))
        }
    }, [selectedWallet]);
    return (
        <div>
            <Card>
                {
                    statistics &&
                    <div className='flex'>
                        <div className='w-1/2'><ChartPie chartConfig={{}} dataKey={'total'} nameKey={'category'}
                                                         data={statistics?.sumExpenseCategories} title='Expenses'/>
                        </div>
                        <div className='w-1/2'><ChartPie data={statistics.sumIncomeCategories} dataKey={'total'}
                                                         nameKey={'category'}
                                                         chartConfig={{}} title='Incomes'/></div>
                    </div>
                }

            </Card>

        </div>
    );
};

export default Dashboard;