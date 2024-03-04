"use client";

import { QueryResult } from "@/app/action";
import { BarChart } from "@tremor/react";

interface BarChartComponentProps {
  queryResult: QueryResult;
  title?: string;
  categories: string[];
  index?: string;
}

export function BarChartComponent({
  queryResult,
  title,
  categories,
  index,
}: BarChartComponentProps) {
  const dataFormatter = (number: number) =>
    Intl.NumberFormat("us").format(number).toString();

  return (
    <>
      <h3 className="text-lg font-medium dark:text-dark-tremor-content-strong">
        {title}
      </h3>
      <BarChart
        data={queryResult.data}
        index={index as string}
        categories={categories.slice(1)}
        colors={["blue"]}
        valueFormatter={dataFormatter}
        yAxisWidth={48}
        onValueChange={(v) => console.log(v)}
        showAnimation={true}
        animationDuration={1000}
      />
    </>
  );
}
