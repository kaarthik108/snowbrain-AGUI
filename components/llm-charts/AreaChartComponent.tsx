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
  onSelectionChange,
}: {
  queryResult: QueryResult;
  title?: string;
  timeField?: string;
  categories: string[];
  onSelectionChange?: (selectedData: any) => void;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const downloadChart = useDownloadChart(chartRef);
  const dataFormatter = (number: number): string =>
    `$${Intl.NumberFormat("us").format(number)}`;

  const [selection, setSelection] = useState<[number, number] | null>(null);

  if (!timeField) {
    console.error("timeField is undefined");
    return null;
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
            (category) => category.toLowerCase() === lowercaseKey,
          );
          if (matchedCategory) {
            filteredEntry[matchedCategory] = value as number;
          }
        }
      }
      return filteredEntry;
    },
  );

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const startIndex = event.clientX;
    setSelection([startIndex, startIndex]);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (selection) {
      const endIndex = event.clientX;
      setSelection([selection[0], endIndex]);
    }
  };

  const handleMouseUp = () => {
    if (selection) {
      const [startIndex, endIndex] = selection;
      const selectedData = filteredData.slice(startIndex, endIndex + 1);
      if (onSelectionChange) {
        onSelectionChange(selectedData);
      }
      setSelection(null);
    }
  };

  // console.log("timeField is", timeField);
  // console.log("categories are", categories);
  // console.log("filteredData is", filteredData);

  // console.log("selection is", selection);

  return (
    <>
      <Card>
        <div
          ref={chartRef}
          className="chart-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
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
          {selection && (
            <div
              className="selection"
              style={{
                left: selection[0],
                width: selection[1] - selection[0],
              }}
            />
          )}
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
