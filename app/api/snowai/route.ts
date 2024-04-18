import * as dotenv from "dotenv";
import { NextRequest, NextResponse } from "next/server";
import * as snowflake from "snowflake-sdk";

dotenv.config({ path: ".env.local" });

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<Response> {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.X_API_KEY) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const snowConnect = snowflake.createConnection({
    account: process.env.ACCOUNT as string,
    username: process.env.USER_NAME as string,
    password: process.env.PASSWORD,
    role: process.env.ROLE,
    warehouse: process.env.WAREHOUSE,
    database: process.env.DATABASE,
    schema: process.env.SCHEMA,
  });

  snowflake.configure({ ocspFailOpen: false });

  const requestBody = await request.json();
  const query = requestBody.query;

  try {
    const result = await new Promise<any[]>((resolve, reject) => {
      snowConnect.connect((err, conn) => {
        if (err) {
          console.error("Unable to connect: " + err.message);
          reject(err);
        } else {
          snowConnect.execute({
            sqlText: query,
            complete: (err, stmt, rows) => {
              if (err) {
                console.error(
                  "Failed to execute statement due to the following error: " +
                    err.message
                );
                reject(err);
              } else {
                resolve(rows || []);
              }
            },
          });
        }
      });
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
