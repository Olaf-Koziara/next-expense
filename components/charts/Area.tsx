"use client"
import {TrendingUp} from "lucide-react"
import {Area, AreaChart as Chart, CartesianGrid, XAxis} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {format} from "date-fns";
import {pieChartColors} from "@/utils/charts";

type Props<T> = {
    data: T[],
    dataKeys: string[],
    valueKeys?: string[],
    chartConfig?: ChartConfig,

    title?: string,
    description?: string
}

function AreaChart<T>({
                          data,
                          chartConfig,
                          dataKeys,
                          valueKeys = ['value'],
                          title,
                          description,

                      }: Props<T>) {
    if (!chartConfig) {
        chartConfig = {};
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <Chart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}

                    >
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey={dataKeys[0]}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => format(new Date(value), 'dd-MM')}

                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot"/>}
                        />
                        {
                            dataKeys.map((key, index) => {
                                if (index > 0) {
                                    return <Area
                                        key={key}
                                        type="monotone"
                                        dataKey={key}
                                        stroke={pieChartColors[index]}
                                        fill={pieChartColors[index]}
                                    />
                                }
                            })
                        }

                    </Chart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4"/>
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            January - June 2024
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default AreaChart;