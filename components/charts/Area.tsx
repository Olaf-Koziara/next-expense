"use client"
import {Area, AreaChart as Chart, CartesianGrid, XAxis} from "recharts"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {pieChartColors} from "@/utils/charts";

type Props<T> = {
    data: T[],
    dataKeys: string[],
    valueKeys?: string[],
    chartConfig?: ChartConfig,
    tickFormatter?: (value: any) => string,
    labelFormatter?: (value: any) => string,
    title?: string,
    description?: string
}

function AreaChart<T>({
                          data,
                          chartConfig,
                          dataKeys,
                          tickFormatter,
                          labelFormatter,

                      }: Props<T>) {
    if (!chartConfig) {
        chartConfig = {};
    }

    return (

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
                    tickMargin={1}
                    interval={0}
                    tickFormatter={tickFormatter}
                    

                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot"/>}
                    labelFormatter={labelFormatter}
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
                                dot={true}
                            />
                        }
                    })
                }

            </Chart>
        </ChartContainer>


    )
}

export default AreaChart;