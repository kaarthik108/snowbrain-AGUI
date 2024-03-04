import { z } from "zod";

const chartTypes = z.enum(["area", "number", "table", "bar", "line"]);
export type ChartType = z.infer<typeof chartTypes>;

export const zOpenAIQueryResponse = z.object({
  query: z.string().describe(`
    Creates a snowflake SQL query based on the context and given query.
  `),
  format: chartTypes.describe(
    "The format of the result, which determines the type of chart to generate."
  ),
  title: z
    .string()
    .describe(
      "The title for the chart, which is displayed prominently above the chart."
    ),
  timeField: z
    .string()
    .optional()
    .describe(
      "Used for time series data, designating the column that represents the time dimension. This field is used as the x-axis in charts like area and bar (if the bar chart is time-based)."
    ),
  categories: z
    .array(z.string())
    .describe(
      "An array of strings that represent the data series names to be visualized on the chart. For 'area' and 'bar' charts, this includes all the series except the timeField or date field. For 'table' charts, this represents the column headers. In 'number' charts, this is typically unused since number charts represent single data points. (THIS SHOULD NOT CONTAIN THE timeField or dateField)"
    ),
  index: z
    .string()
    .optional()
    .describe(
      "Specific to 'bar' charts, this denotes the primary categorical axis, typically the labels that run along the x-axis. For time series bar charts, this can often be the same as timeField. This is a must for 'bar' charts."
    ),
  // Additional properties can be included here as needed for other chart types or specifics.
});
