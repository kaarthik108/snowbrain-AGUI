"use client";

import { QueryResult } from "@/app/action";
import { AreaChart, AreaChartProps } from "@tremor/react";
import { useState } from "react";

interface ExtendedAreaChartProps extends AreaChartProps {
  onSelectionChange: (selectedData: any) => void;
}

export function AreaChartComponent({
  queryResult,
  title,
  timeField,
  categories,
}: {
  queryResult: QueryResult;
  title?: string;
  timeField?: string;
  categories: string[];
}) {
  const dataFormatter = (number: number) =>
    `$${Intl.NumberFormat("us").format(number).toString()}`;

  const [selection, setSelection] = useState<[number, number] | null>(null);

  const handleSelectionChange = (selectedData: any) => {
    if (selectedData.length === 0) {
      setSelection(null); // Reset selection if nothing is selected
    } else {
      const startIndex = selectedData[0].index;
      const endIndex = selectedData[selectedData.length - 1].index;
      setSelection([startIndex, endIndex]);
    }
  };

  return (
    <>
      <span className="text-lg font-medium dark:text-dark-tremor-content-strong">
        {title}
      </span>
      <AreaChart
        className="h-80"
        data={queryResult.data}
        index={timeField as string}
        categories={categories}
        colors={["indigo", "rose"]}
        valueFormatter={dataFormatter}
        yAxisWidth={60}
        showAnimation={true}
        animationDuration={1000}
        onValueChange={(v: any) => console.log(v)} // Temporary any type for EventProps
        {...(handleSelectionChange
          ? { onSelectionChange: handleSelectionChange }
          : {})}
      />
      {selection && (
        <div className="mt-4">
          Selection: {selection[0]} - {selection[1]}
        </div>
      )}
    </>
  );
}
