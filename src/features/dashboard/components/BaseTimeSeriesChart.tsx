import { type DateTimeAggregationOption } from "@/src/features/dashboard/lib/timeseries-aggregation";
import { compactNumberFormatter } from "@/src/utils/numbers";
import { cn } from "@/src/utils/tailwind";
import { AreaChart } from "@tremor/react";

export type TimeSeriesChartDataPoint = {
  ts: number;
  values: { label: string; value?: number }[];
};

export function BaseTimeSeriesChart(props: {
  className?: string;
  agg: DateTimeAggregationOption;
  data: TimeSeriesChartDataPoint[];
  showLegend?: boolean;
  connectNulls?: boolean;
  valueFormatter?: (value: number) => string;
}) {
  const labels = new Set(
    props.data.flatMap((d) => d.values.map((v) => v.label)),
  );

  type ChartInput = { timestamp: string } & {
    [key: string]: number | undefined;
  };

  function transformArray(array: TimeSeriesChartDataPoint[]): ChartInput[] {
    return array.map((item) => {
      const outputObject: ChartInput = {
        timestamp: convertDate(item.ts, props.agg),
      } as ChartInput;

      item.values.forEach((valueObject) => {
        outputObject[valueObject.label] = valueObject.value;
      });

      return outputObject;
    });
  }

  const convertDate = (date: number, agg: DateTimeAggregationOption) => {
    if (agg === "24 hours" || agg === "1 hour" || agg === "30 minutes") {
      return new Date(date).toLocaleTimeString("en-US", {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return new Date(date).toLocaleDateString("en-US", {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
    });
  };
  return (
    <AreaChart
      className={cn("mt-4", props.className)}
      data={transformArray(props.data)}
      index="timestamp"
      categories={Array.from(labels)}
      connectNulls={props.connectNulls}
      colors={["indigo", "cyan", "zinc", "purple"]}
      valueFormatter={
        props.valueFormatter ? props.valueFormatter : compactNumberFormatter
      }
      noDataText="No data"
      showLegend={props.showLegend}
      showAnimation={true}
    />
  );
}
