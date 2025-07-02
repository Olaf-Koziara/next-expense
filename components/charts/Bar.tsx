"use client";
import { Bar, BarChart as Chart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { pieChartColors } from "@/utils/charts";

export function BarChart<T>({
  data,
  dataKeys,
  chartConfig,
  tickFormatter,
  labelFormatter,
}: BarChartProps<T>) {
  if (!chartConfig) chartConfig = {};

  if (!chartConfig["desktop"].height) {
    chartConfig["desktop"]["height"] = 400;
  }
  // const mobileHeight: number | undefined = chartConfig["mobile"]?.height;
  return (
    <ChartContainer config={chartConfig}>
      <Chart
        accessibilityLayer
        data={data}
        margin={{ left: 12, right: 12, top: 20, bottom: 10 }}
        width={900}
        height={400}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={dataKeys[0]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval="preserveStartEnd"
          minTickGap={50}
          tickFormatter={tickFormatter}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tickCount={20} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
          labelFormatter={labelFormatter}
        />
        {dataKeys.slice(1).map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={pieChartColors[index]}
            stroke={pieChartColors[index]}
            barSize={24}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </Chart>
    </ChartContainer>
  );
}

export interface BarChartProps<T> {
  data: T[];
  dataKeys: string[];
  chartConfig?: ChartConfig;
  tickFormatter?: (value: Partial<T>) => string;
  labelFormatter?: (value: Partial<T>) => string;
  height?: number;
}
