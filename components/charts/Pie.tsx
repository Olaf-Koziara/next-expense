"use client"

import * as React from "react"
import {Label, Pie, PieChart} from "recharts"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"


type Props<T> = {
    data: T[],
    dataKey: keyof T,
    nameKey: string,
    chartConfig: ChartConfig,
    total?: number
    title?: string,
    description?: string
}

const ChartPie = <T, >({data, chartConfig, dataKey, nameKey}: Props<T>) => {
    const total = React.useMemo(() => {
        return data.reduce((acc, curr) => acc + (curr[dataKey] as number), 0).toFixed(2)
    }, [data, dataKey])
    return (

        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel/>}
                />
                <Pie
                    data={data}
                    dataKey={dataKey as string}
                    nameKey={nameKey}
                    innerRadius={60}
                    strokeWidth={5}
                >
                    <Label
                        content={({viewBox}) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold"
                                        >
                                            {total}

                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Total
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>

    )
}
export default ChartPie;
