"use client";
import { QueryResult } from "@/app/action";
import { useDownloadChart } from "@/lib/hooks/useDownloadChart";
import { Card, ScatterChart } from "@tremor/react";
import { useRef } from "react";
import { Button } from "../ui/button";
import { IconDownload } from "../ui/icons";

interface ScatterChartComponentProps {
  queryResult: QueryResult;
  title?: string;
  index?: string;
  category: string;
  yaxis: string;
  size: string;
}

export function ScatterChartComponent({
  queryResult,
  title,
  index,
  category,
  yaxis,
  size,
}: ScatterChartComponentProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const downloadChart = useDownloadChart(chartRef);
  const filteredData = queryResult.data.map((entry) => {
    const filteredEntry: { [key: string]: string | number } = {};

    if (index && entry.hasOwnProperty(index)) {
      filteredEntry[index] = entry[index];
    }

    if (category && entry.hasOwnProperty(category)) {
      filteredEntry[category] = entry[category];
    }

    if (yaxis && entry.hasOwnProperty(yaxis)) {
      filteredEntry[yaxis] = entry[yaxis];
    }

    if (size && entry.hasOwnProperty(size)) {
      filteredEntry[size] = entry[size];
    }

    return filteredEntry;
  });
  console.log("index is", index);
  console.log("category is", category);
  console.log("yaxis is", yaxis);
  console.log("size is", size);
  console.log("filteredData is", filteredData);

  return (
    <>
      <Card>
        <div ref={chartRef} className="chart-container">
          <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mb-4">
            {title}
          </p>
          <ScatterChart
            className="-ml-2 mt-6 h-80"
            yAxisWidth={50}
            data={filteredData}
            category={category}
            x={index as string}
            y={yaxis as string}
            size={size as string}
            showOpacity={true}
            minYValue={60}
            enableLegendSlider
            colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
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
