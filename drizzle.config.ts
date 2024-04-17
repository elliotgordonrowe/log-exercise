import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

import { dbCredentials } from "./src/db/db.ts";

dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: dbCredentials,
  driver: "mysql2",
} satisfies Config;
