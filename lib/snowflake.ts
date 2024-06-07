export async function executeSnowflakeQuery(sqlText: string) {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://snowbrain-agui.vercel.app"
      : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/snow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY as string,
    },
    body: JSON.stringify({ query: sqlText }),
  });

  if (!res.ok) {
    throw new Error("Failed to execute query");
  }

  const data = await res.json();
  return data;
}
