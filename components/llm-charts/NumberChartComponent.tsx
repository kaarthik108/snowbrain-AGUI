"use client";

import { QueryResult } from "@/app/action";
import { Card } from "@tremor/react";

export function NumberChartComponent({
  queryResult,
  title,
}: {
  queryResult: QueryResult;
  title?: string;
}) {
  if (
    queryResult.data.length === 1 &&
    Object.keys(queryResult.data[0]).length === 1
  ) {
    const key = Object.keys(queryResult.data[0])[0];
    const value = queryResult.data[0][key];
    const isNumeric = !isNaN(parseFloat(value)) && isFinite(value);

    return (
      <Card
        className="mx-auto max-w-xs"
        decoration="top"
        decorationColor="indigo"
      >
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          {title}
        </p>
        <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
          {isNumeric ? `$${parseFloat(value).toFixed(2)}` : value}
        </p>
      </Card>
    );
  } else {
    return (
      <Card className="mx-auto max-w-xs">
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Expected data not found.
        </p>
      </Card>
    );
  }
}
