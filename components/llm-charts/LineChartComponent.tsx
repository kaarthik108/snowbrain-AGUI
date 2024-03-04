"use client";

import { QueryResult } from "@/app/action";
import { LineChart } from "@tremor/react";

export function LineChartComponent({
  queryResult,
  title,
  categories,
  index,
}: {
  queryResult: QueryResult;
  title?: string;
  categories: string[];
  index?: string;
}) {
  const dataFormatter = (number: number) =>
    `$${Intl.NumberFormat("us").format(number).toString()}`;

  return (
    <>
      <h3 className="text-lg font-medium dark:text-dark-tremor-content-strong">
        {title}
      </h3>
      <LineChart
        className="h-80"
        data={queryResult.data}
        index={index as string}
        categories={categories}
        colors={["indigo", "rose"]}
        valueFormatter={dataFormatter}
        yAxisWidth={60}
        showAnimation={true}
        animationDuration={1000}
        onValueChange={(v) => console.log(v)}
      />
    </>
  );
}
