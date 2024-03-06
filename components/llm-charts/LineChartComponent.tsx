"use client";
import { AI, QueryResult } from "@/app/action";
import { useDownloadChart } from "@/lib/hooks/useDownloadChart";
import { Card, LineChart } from "@tremor/react";
import { useAIState, useActions, useUIState } from "ai/rsc";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { IconDownload } from "../ui/icons";

export function LineChartComponent({
  queryResult,
  title,
  categories,
  index,
  onSelectionChange,
}: {
  queryResult: QueryResult;
  title?: string;
  categories: string[];
  index?: string;
  onSelectionChange?: (selectedData: any) => void;
}) {
  const { submitUserMessage } = useActions<typeof AI>();
  const [messages, setMessages] = useUIState<typeof AI>();

  const id = useId();
  const [history, setHistory] = useAIState<typeof AI>();

  const chartRef = useRef<HTMLDivElement>(null);
  const downloadChart = useDownloadChart(chartRef);
  const dataFormatter = (number: number) =>
    `$${Intl.NumberFormat("us").format(number).toString()}`;

  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

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

  const getXValue = (x: number) => {
    const chartWidth = chartRef.current?.offsetWidth || 0;
    const dataLength = filteredData.length;
    const dataIndex = Math.round((x / chartWidth) * (dataLength - 1));
    return filteredData[dataIndex]?.[index as string];
  };

  const getYValue = (y: number, category: string) => {
    const chartHeight = chartRef.current?.offsetHeight || 0;
    const minValue = Math.min(
      ...filteredData.map((entry) => entry[category] as number)
    );
    const maxValue = Math.max(
      ...filteredData.map((entry) => entry[category] as number)
    );
    const value =
      ((chartHeight - y) / chartHeight) * (maxValue - minValue) + minValue;
    return value;
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setSelectionStart({ x, y });
      setSelectionEnd({ x, y });
      setIsSelecting(true);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isSelecting && selectionStart) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setSelectionEnd({ x, y });
    }
  };

  const handleMouseUp = async () => {
    if (isSelecting && selectionStart && selectionEnd && index) {
      const startX = getXValue(selectionStart.x);
      const endX = getXValue(selectionEnd.x);

      const selectedItems = filteredData.filter((entry) => {
        const xValue = entry[index];
        return xValue >= startX && xValue <= endX;
      });

      const selectedDataItems = selectedItems.map((item) => {
        const selectedItem: { [key: string]: string | number } = {};
        selectedItem[index] = item[index];
        categories.forEach((category) => {
          selectedItem[category] = item[category];
        });
        return selectedItem;
      });

      setSelectedData(selectedDataItems);
      setIsSelecting(false);

      if (selectedDataItems.length > 0) {
        console.log("Selected Data:", selectedDataItems);
        const message = {
          id,
          role: "system" as const,
          content: `The user has selected the following data points from the graph:
${JSON.stringify(selectedDataItems, null, 2)}

Based on the selected data, please provide insights and analysis considering the following aspects:

1. Identify any notable patterns, trends, or outliers in the selected data.
2. Compare the selected data points with the overall dataset and discuss their significance.
3. Provide possible explanations or hypotheses for the observed patterns or trends.
4. Discuss the implications or consequences of the selected data points in the context of the given graph or dataset.
5. If applicable, suggest further analyses or data points to explore based on the selected data.

Please provide a clear and concise response, using the selected data to support your observations and conclusions.`,
        };

        if (history[history.length - 1]?.id === id) {
          setHistory((prevHistory) => [...prevHistory.slice(0, -1), message]);
        } else {
          setHistory((prevHistory) => [...prevHistory, message]);
        }
        const responseMessage = await submitUserMessage(message.content);
        setMessages((currentMessages) => [...currentMessages, responseMessage]);

        if (onSelectionChange) {
          onSelectionChange(selectedDataItems);
        }
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isSelecting && selectionStart && selectionEnd) {
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  };

  console.log("Selected Data:", selectedData);

  return (
    <>
      <Card>
        <div
          ref={chartRef}
          className="chart-container relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
        >
          <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mb-4">
            {title}
          </p>
          <div className="relative">
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
            />
            {selectionStart && selectionEnd && (
              <div
                className={`selection absolute border-2 ${
                  isSelecting ? "border-blue-500" : "border-gray-500"
                } bg-blue-100 bg-opacity-20 pointer-events-none`}
                style={{
                  left: Math.min(selectionStart.x, selectionEnd.x),
                  top: Math.min(selectionStart.y, selectionEnd.y),
                  width: Math.abs(selectionEnd.x - selectionStart.x),
                  height: Math.abs(selectionEnd.x - selectionStart.x),
                }}
              />
            )}
          </div>
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
