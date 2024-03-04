export async function executeSnowflakeQuery(sqlText: string) {
  const modal = process.env.MODAL_URL;

  const res = await fetch(`${modal}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sqlText }),
  });

  if (!res.ok) {
    throw new Error("Failed to execute query");
  }

  const data = await res.json();
  return data;
}
// const query = `select * from order_details limit 5`;

// executeSnowflakeQuery(query).then((res) => {
//   console.log("Query executed successfully", res);
// });

// return new Promise((resolve, reject) => {
//   const snowConnect = snowflake.createConnection({
//     account: process.env.ACCOUNT,
//     username: process.env.USER_NAME,
//     password: process.env.PASSWORD,
//     authenticator: "SNOWFLAKE",
//     role: process.env.ROLE,
//     warehouse: process.env.WAREHOUSE,
//     database: process.env.DATABASE,
//     schema: process.env.SCHEMA,
//   });

//   //  snowflake.configure({ ocspFailOpen: false });

//   snowConnect.connect((err, conn) => {
//     if (err) {
//       console.error("Unable to connect: " + err.message);
//       reject(err);
//     } else {
//       console.log("Successfully connected as id: " + snowConnect.getId());
//       snowConnect.execute({
//         sqlText,
//         complete: (err, stmt, rows) => {
//           if (err) {
//             console.error(
//               "Failed to execute statement due to the following error: " +
//                 err.message
//             );
//             reject(err);
//           } else {
//             console.log(
//               "Successfully executed statement: " + stmt.getSqlText()
//             );
//             resolve(rows);
//           }
//         },
//       });
//     }
//   });
// });
