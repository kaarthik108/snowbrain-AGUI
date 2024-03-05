"use client";
import { QueryResult } from "@/app/action";
import { useDownloadChart } from "@/lib/hooks/useDownloadChart";
import { Card, DonutChart } from "@tremor/react";
import { useRef } from "react";
import { Button } from "../ui/button";
import { IconDownload } from "../ui/icons";

interface DonutChartComponentProps {
  queryResult: QueryResult;
  title?: string;
  index?: string;
  category?: string;
}

export function DonutChartComponent({
  queryResult,
  title,
  index,
  category,
}: DonutChartComponentProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const downloadChart = useDownloadChart(chartRef);
  const dataFormatter = (number: number) =>
    Intl.NumberFormat("us").format(number).toString();

  const filteredData = queryResult.data.map((entry) => {
    const filteredEntry: { [key: string]: string | number } = {};

    if (index && entry.hasOwnProperty(index)) {
      filteredEntry[index] = entry[index];
    }

    if (category && entry.hasOwnProperty(category)) {
      filteredEntry[category] = entry[category];
    }

    return filteredEntry;
  });

  return (
    <>
      <Card>
        <div ref={chartRef} className="chart-container">
          <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mb-4">
            {title}
          </p>
          <DonutChart
            data={filteredData}
            index={index as string}
            category={category as string}
            variant="donut"
            colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
            valueFormatter={dataFormatter}
            onValueChange={(v) => console.log(v)}
            showAnimation={true}
            animationDuration={1000}
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
