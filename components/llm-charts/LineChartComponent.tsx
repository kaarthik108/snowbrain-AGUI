"use client";
import { QueryResult } from "@/app/action";
import { useDownloadChart } from "@/lib/hooks/useDownloadChart";
import { Card, LineChart } from "@tremor/react";
import { useRef } from "react";
import { Button } from "../ui/button";
import { IconDownload } from "../ui/icons";

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
  const chartRef = useRef<HTMLDivElement>(null);
  const downloadChart = useDownloadChart(chartRef);
  const dataFormatter = (number: number) =>
    `$${Intl.NumberFormat("us").format(number).toString()}`;

  const filteredData = queryResult.data.map((entry) => {
    const filteredEntry: { [key: string]: string | number } = {};

    if (index) {
      const upperCaseIndex = index.toUpperCase();
      if (entry.hasOwnProperty(upperCaseIndex)) {
        filteredEntry[index] = entry[upperCaseIndex];
      }
    }

    categories.forEach((category) => {
      const upperCaseCategory = category.toUpperCase();
      if (entry.hasOwnProperty(upperCaseCategory)) {
        filteredEntry[category] = entry[upperCaseCategory];
      }
    });

    return filteredEntry;
  });

  return (
    <>
      <Card>
        <div ref={chartRef} className="chart-container">
          <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mb-4">
            {title}
          </p>
          <LineChart
            className="h-80"
            data={filteredData}
            index={index as string}
            categories={categories}
            colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
            valueFormatter={dataFormatter}
            yAxisWidth={60}
            showAnimation={true}
            animationDuration={1000}
            onValueChange={(v) => console.log(v)}
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
