"use client";
import { AI, QueryResult } from "@/app/action";
import { Card } from "@tremor/react";

import { ChartType } from "@/lib/params";
import { AreaComp, LineComp, NumberComp, TableComp } from "./llm-charts";

// make me an area chart of all order amount over time

interface ChartProps {
  queryResult: QueryResult;
  chartType: ChartType;
  title?: string;
  description?: string;
  timeField?: string;
  categories: string[];
  index?: string;
}

export function Chart({
  queryResult,
  chartType,
  title,
  timeField,
  categories,
  index,
}: ChartProps) {
  try {
    switch (chartType) {
      case "area":
        return (
          <AreaComp
            queryResult={queryResult}
            title={title}
            timeField={timeField}
            categories={categories}
          />
        );
      case "number":
        return <NumberComp queryResult={queryResult} title={title} />;
      case "table":
        return <TableComp queryResult={queryResult} title={title} />;
      case "line":
        return (
          <LineComp
            queryResult={queryResult}
            title={title}
            index={timeField}
            categories={categories}
          />
        );

      default:
        throw new Error(`Unsupported chart type: ${chartType}`);
    }
  } catch (error) {
    console.error(error);
    return (
      <div className="flex items-center justify-center">
        <Card>
          <p className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
            Error rendering chart
          </p>
        </Card>
      </div>
    );
  }
}
export const t_query_result = {
  columns: ["ORDER_ID", "CUSTOMER_ID", "ORDER_DATE", "TOTAL_AMOUNT"],
  results: [
    { ORDER_DATE: "2023-04-01", TOTAL_AMOUNT: 120.99 },
    { ORDER_DATE: "2023-04-02", TOTAL_AMOUNT: 75.5 },
    { ORDER_DATE: "2023-04-03", TOTAL_AMOUNT: 140.25 },
    { ORDER_DATE: "2023-04-04", TOTAL_AMOUNT: 89.99 },
    { ORDER_DATE: "2023-04-05", TOTAL_AMOUNT: 210.45 },
    { ORDER_DATE: "2023-04-06", TOTAL_AMOUNT: 55 },
    { ORDER_DATE: "2023-04-07", TOTAL_AMOUNT: 123.75 },
    { ORDER_DATE: "2023-04-08", TOTAL_AMOUNT: 79.3 },
    { ORDER_DATE: "2023-04-09", TOTAL_AMOUNT: 45.9 },
    { ORDER_DATE: "2023-04-10", TOTAL_AMOUNT: 99.99 },
  ],
};
