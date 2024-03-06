import "server-only";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import OpenAI from "openai";

import {
  BotCard,
  BotMessage,
  Chart,
  SystemMessage,
  spinner,
} from "@/components/llm-charts";

import { getContext } from "@/lib/context";
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  runOpenAICompletion,
  sleep,
} from "@/lib/utils";
import { FQueryResponse } from "@/lib/validation";
import { Code } from "bright";
import { z } from "zod";

import AreaSkeleton from "@/components/llm-charts/AreaSkeleton";
import { MemoizedReactMarkdown } from "@/components/llm-charts/markdown";
import { executeQueryWithCache } from "@/lib/snowCache";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { format as sql_format } from "sql-formatter";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Please set the OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_TAG}/snowbrain/openai`,
});
type OpenAIQueryResponse = z.infer<typeof FQueryResponse>;

export interface QueryResult {
  columns: string[];
  data: Array<{ [key: string]: any }>;
}

async function submitUserMessage(content: string) {
  "use server";
  const getDDL = await getContext(content);
  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content,
    },
  ]);

  const reply = createStreamableUI(
    <BotMessage className="items-center">{spinner}</BotMessage>
  );
  const completion = runOpenAICompletion(openai, {
    model: "gpt-4-0125-preview",
    stream: true,
    messages: [
      {
        role: "system",
        content: `\
You are a snowflake data analytics assistant. You can help users with sql queries and you can help users query their data with only using snowflake sql syntax. Based on the context provided about snowflake DDL schema details, you can help users with their queries.
You and the user can discuss their events and the user can request to create new queries or refine existing ones, in the UI.

Always use proper aliases for the columns and tables in the queries. For example, instead of using "select * from table_name", use "select column_name as alias_name from table_name as alias_name".

Messages inside [] means that it's a UI element or a user event. For example:
- "[Results for query: query with format: format and title: title and description: description. with data" means that a chart/table/number card is shown to that user.

Context: (DDL schema details) \n

${getDDL}

\n

The current time is ${new Date().toISOString()}.


If the user requests to fetch or query data, call \`query_data\` to query the data from the snowflake database and return the results.

Besides that, you can also chat with users and do some calculations if needed.`,
      },
      ...aiState.get().map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    functions: [
      {
        name: "query_data",
        description:
          "Query the data from the snowflake database and return the results.",
        parameters: FQueryResponse,
      },
    ],
    temperature: 0,
  });

  completion.onTextContent((content: string, isFinal: boolean) => {
    reply.update(
      <BotMessage>
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
          }}
        >
          {content}
        </MemoizedReactMarkdown>
      </BotMessage>
    );
    if (isFinal) {
      reply.done();
      aiState.done([...aiState.get(), { role: "assistant", content }]);
    }
  });

  completion.onFunctionCall(
    "query_data",
    async (input: OpenAIQueryResponse) => {
      reply.update(
        <BotMessage className="">
          <SystemMessage>
            <AreaSkeleton />
          </SystemMessage>
        </BotMessage>
      );
      const { format, title, timeField, categories, index, yaxis, size } =
        input;
      console.log("Received timeField:", timeField);
      console.log("Received format:", format);
      console.log("Received title:", title);
      console.log("Received categories:", categories);
      console.log("Received index:", index);
      console.log("Received yaxis:", yaxis);
      console.log("Received size:", size);
      let query = input.query;

      const format_query = sql_format(query, { language: "sql" });

      const res = await executeQueryWithCache(format_query);
      console.log("Query results:", res);
      // const res = testquery;
      const compatibleQueryResult: QueryResult = {
        columns: res.columns,
        data: res.data,
      };

      reply.done(
        <BotCard>
          <SystemMessage>
            <div className="">
              <Chart
                chartType={format}
                queryResult={compatibleQueryResult}
                title={title}
                timeField={timeField}
                categories={categories}
                index={index}
                yaxis={yaxis}
                size={size}
              />
              <div className="py-4 whitespace-pre-line">
                <Code lang="sql">{format_query}</Code>
              </div>
            </div>
          </SystemMessage>
        </BotCard>
      );

      aiState.done([
        ...aiState.get(),
        {
          role: "function",
          name: "query_data",
          content: `[Snowflake query results for code: ${query} and chart format: ${format} with categories: ${categories} and data ${res.columns} ${res.data}]`,
        },
      ]);
    }
  );

  return {
    id: Date.now(),
    display: reply.value,
  };
}

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});

export const testquery = {
  columns: ["ORDER_ID", "CUSTOMER_ID", "ORDER_DATE", "TOTAL_AMOUNT"],
  data: [
    {
      ORDER_ID: 1,
      CUSTOMER_ID: 1,
      ORDER_DATE: "2023-04-01",
      TOTAL_AMOUNT: 120.99,
    },
    {
      ORDER_ID: 2,
      CUSTOMER_ID: 2,
      ORDER_DATE: "2023-04-02",
      TOTAL_AMOUNT: 75.5,
    },
    {
      ORDER_ID: 3,
      CUSTOMER_ID: 3,
      ORDER_DATE: "2023-04-03",
      TOTAL_AMOUNT: 140.25,
    },
    {
      ORDER_ID: 4,
      CUSTOMER_ID: 4,
      ORDER_DATE: "2023-04-04",
      TOTAL_AMOUNT: 89.99,
    },
    {
      ORDER_ID: 5,
      CUSTOMER_ID: 5,
      ORDER_DATE: "2023-04-05",
      TOTAL_AMOUNT: 210.45,
    },
    {
      ORDER_ID: 6,
      CUSTOMER_ID: 6,
      ORDER_DATE: "2023-04-06",
      TOTAL_AMOUNT: 55,
    },
    {
      ORDER_ID: 7,
      CUSTOMER_ID: 7,
      ORDER_DATE: "2023-04-07",
      TOTAL_AMOUNT: 123.75,
    },
    {
      ORDER_ID: 8,
      CUSTOMER_ID: 8,
      ORDER_DATE: "2023-04-08",
      TOTAL_AMOUNT: 79.3,
    },
    {
      ORDER_ID: 9,
      CUSTOMER_ID: 9,
      ORDER_DATE: "2023-04-09",
      TOTAL_AMOUNT: 45.9,
    },
    {
      ORDER_ID: 10,
      CUSTOMER_ID: 10,
      ORDER_DATE: "2023-04-10",
      TOTAL_AMOUNT: 99.99,
    },
  ],
};
