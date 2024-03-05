"use client";

import { QueryResult } from "@/app/action";
import { useDownloadChart } from "@/lib/hooks/useDownloadChart";
import { AreaChart, AreaChartProps, Card } from "@tremor/react";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { IconDownload } from "../ui/icons";

interface ExtendedAreaChartProps extends AreaChartProps {
  onSelectionChange?: (selectedData: any) => void;
}

interface FilteredEntry {
  [key: string]: number | string;
}

export function AreaChartComponent({
  queryResult,
  title,
  timeField,
  categories,
}: {
  queryResult: QueryResult;
  title?: string;
  timeField?: string; // Correctly mark as possibly undefined for strict type checking
  categories: string[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const downloadChart = useDownloadChart(chartRef);

  const dataFormatter = (number: number): string =>
    `$${Intl.NumberFormat("us").format(number)}`;

  const [selection, setSelection] = useState<[number, number] | null>(null);

  // Ensure timeField is defined before proceeding
  if (!timeField) {
    // Handle the error or provide a fallback for timeField if it's essential
    console.error("timeField is undefined");
    return null; // or a placeholder component
  }
  const filteredData: FilteredEntry[] = queryResult.data.map(
    (entry): FilteredEntry => {
      const filteredEntry: FilteredEntry = {};

      for (const [key, value] of Object.entries(entry)) {
        const lowercaseKey = key.toLowerCase();
        if (lowercaseKey === timeField.toLowerCase()) {
          filteredEntry[timeField] = value as string;
        } else {
          const matchedCategory = categories.find(
            (category) => category.toLowerCase() === lowercaseKey
          );
          if (matchedCategory) {
            filteredEntry[matchedCategory] = value as number;
          }
        }
      }

      return filteredEntry;
    }
  );

  return (
    <>
      <Card>
        <div ref={chartRef} className="chart-container">
          <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mb-4">
            {title}
          </p>
          <AreaChart
            data={filteredData}
            index={timeField}
            categories={categories}
            colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
            valueFormatter={dataFormatter}
            yAxisWidth={50}
            showAnimation={true}
            animationDuration={1000}
            showLegend
            onValueChange={(v: any) => console.log(v)}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button
            className="px-4 py-2 rounded-full download-btn text-foreground"
            variant={"outline"}
            onClick={downloadChart}
          >
            Download
            <IconDownload className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </>
  );
}
