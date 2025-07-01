"use client";
import {
  Area,
  AreaChart as Chart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { pieChartColors } from "@/utils/charts";

type Props<T> = {
  data: T[];
  dataKeys: string[];
  valueKeys?: string[];
  chartConfig?: ChartConfig;
  tickFormatter?: (value: Partial<T>) => string;
  labelFormatter?: (value: Partial<T>) => string;
  title?: string;
  description?: string;
};

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
  if (!chartConfig["desktop"]?.height) {
    if (chartConfig["desktop"]) {
      chartConfig["desktop"]["height"] = 400;
    } else {
      Object.assign(chartConfig, { desktop: { height: 400 } });
    }
  }
  return (
    <ChartContainer config={chartConfig}>
      <Chart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
          top: 20,
          bottom: 20,
        }}
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
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
          labelFormatter={labelFormatter}
        />
        {dataKeys.map((key, index) => {
          if (index > 0) {
            return (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={pieChartColors[index]}
                fill={pieChartColors[index]}
                dot={true}
                activeDot={{ r: 4 }}
                strokeWidth={2}
              />
            );
          }
        })}
      </Chart>
    </ChartContainer>
  );
}

export default AreaChart;
