import { redis } from "./redis";
import { executeSnowflakeQuery } from "./snowflake";

async function getCachedQueryResult(query: string): Promise<any | null> {
  try {
    const cachedResult: string | null = await redis.get(query);
    if (cachedResult) {
      console.log(`Successfully retrieved and parsed cached result for query:`);
      return cachedResult;
    } else {
      // console.log(`No cached result for query: ${query}`);
      return null;
    }
  } catch (e) {
    console.error(
      `Error retrieving or parsing cached result for query: ${query}`,
      JSON.stringify(e, null, 2)
    );
    return null;
  }
}

async function setCachedQueryResult(query: string, result: any): Promise<void> {
  try {
    const resultString: string = JSON.stringify(result);
    await redis.set(query, resultString, { ex: 3 * 60 * 60 });
  } catch (e) {
    console.error(
      `Error caching result for query: ${query}`,
      JSON.stringify(e, null, 2)
    );
  }
}

export async function executeQueryWithCache(query: string): Promise<any> {
  let result = await getCachedQueryResult(query);
  if (result) {
    console.log("Returning cached result");
    return result;
  }

  console.log("Executing query and caching result");
  // result = test_result; // Placeholder for actual query execution
  result = await executeSnowflakeQuery(query);
  await setCachedQueryResult(query, result);

  return result;
}
const test_result = {
  columns: ["ORDER_DATE", "TOTAL_VALUE"],
  data: [
    { ORDER_DATE: "2023-04-01", TOTAL_VALUE: 120.99 },
    { ORDER_DATE: "2023-04-02", TOTAL_VALUE: 75.5 },
    { ORDER_DATE: "2023-04-03", TOTAL_VALUE: 140.25 },
    { ORDER_DATE: "2023-04-04", TOTAL_VALUE: 89.99 },
    { ORDER_DATE: "2023-04-05", TOTAL_VALUE: 210.45 },
    { ORDER_DATE: "2023-04-06", TOTAL_VALUE: 55 },
    { ORDER_DATE: "2023-04-07", TOTAL_VALUE: 123.75 },
    { ORDER_DATE: "2023-04-08", TOTAL_VALUE: 79.3 },
    { ORDER_DATE: "2023-04-09", TOTAL_VALUE: 45.9 },
    { ORDER_DATE: "2023-04-10", TOTAL_VALUE: 99.99 },
  ],
};
