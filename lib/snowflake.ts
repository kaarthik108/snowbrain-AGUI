export async function executeSnowflakeQuery(sqlText: string) {
  const modal = process.env.MODAL_URL;

  const res = await fetch(`${modal}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MODAL_AUTH_TOKEN}`,
    },
    body: JSON.stringify({ query: sqlText }),
  });

  if (!res.ok) {
    throw new Error("Failed to execute query");
  }

  const data = await res.json();
  return data;
}
