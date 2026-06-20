import { Pool } from "pg";
import { env } from "../../config/env";
import { logger } from "../../common/utils/logger";

export const pgPool = new Pool({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,
});

export async function verifyPostgresConnection(): Promise<void> {
  const result = await pgPool.query("SELECT NOW() AS now");
  logger.info("system", "PostgreSQL connection verified", { now: result.rows[0]?.now });
}

export async function closePostgresConnection(): Promise<void> {
  await pgPool.end();
  logger.info("system", "PostgreSQL connection pool closed");
}
