"use client";
import React from "react";
import { useWallet } from "@/context/WalletContext";
import ChartPie from "@/components/charts/Pie";
import Area from "@/components/charts/Area";
import { prepareExpenseDataForAreaChart } from "@/utils/calculate";
import useCategories from "@/hooks/useCategories";
import { StatisticsFilter } from "@/app/(root)/(components)/StatisticsFilter";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStatistics } from "@/hooks/useStatistics";
import { DateRange } from "@/types/DateRange";
import { format } from "date-fns";
import { countDaysBetweenTwoDates } from "@/utils/date";
import { Label, ResponsiveContainer } from "recharts";
import { BarChart } from "@/components/charts/Bar";
const formatDate = (date: Date) => format(date, "dd-MM-yyyy");

const Dashboard = () => {
  const { selectedWallet } = useWallet();
  const { categories: expenseCategories } = useCategories("expense");
  const { categories: incomeCategories } = useCategories("income");
  const { statistics, isLoading, error, fetchStatistics } = useStatistics();
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });

  React.useEffect(() => {
    if (selectedWallet?._id) {
      fetchStatistics(selectedWallet._id, dateRange).then(() => {});
    }
  }, [selectedWallet?._id, dateRange, fetchStatistics]);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="sticky top-0 z-10 backdrop-blur-sm border-b p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <StatisticsFilter onChange={setDateRange} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={64} />
        </div>
      ) : statistics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className=" shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">
                Expense Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartPie
                data={statistics.summedExpenseCategories}
                dataKey="total"
                nameKey="category"
                chartConfig={{
                  theme: {
                    light: "#ef4444",
                    dark: "#ef4444",
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">
                Income Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartPie
                data={statistics.summedIncomeCategories}
                dataKey="total"
                nameKey="category"
                chartConfig={{
                  theme: {
                    light: "#22c55e",
                    dark: "#22c55e",
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">
                Expense Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <BarChart
                  data={prepareExpenseDataForAreaChart(
                    statistics.summedExpenseCategoriesAndDate
                  )}
                  dataKeys={[
                    "date",
                    ...expenseCategories.map((category) => category.name),
                  ]}
                  tickFormatter={formatDate}
                  labelFormatter={formatDate}
                  chartConfig={{
                    desktop: {
                      theme: {
                        light: "#ef4444",
                        dark: "#ef4444",
                      },
                      aspect: 3,
                      height: 300,
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">
                Income Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="">
                <div className="min-w-[800px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <Area
                      data={prepareExpenseDataForAreaChart(
                        statistics.summedIncomeCategoriesAndDate
                      )}
                      dataKeys={[
                        "date",
                        ...incomeCategories.map((category) => category.name),
                      ]}
                      tickFormatter={formatDate}
                      labelFormatter={formatDate}
                      chartConfig={{
                        theme: {
                          light: "#22c55e",
                          dark: "#22c55e",
                        },
                      }}
                    />
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
