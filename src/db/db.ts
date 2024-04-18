import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

export const dbCredentials = {
  host: "localhost",
  user: "elliotrowe",
  database: "logs",
  password: "test123",
};

const dbPromise = (async () => {
  const connection = await mysql.createConnection(dbCredentials);

  return drizzle(connection);
})();

export { dbPromise };
