import { Pool, PoolClient } from "pg";

export interface PostgresDatabaseConfig {
  pool: Pool;
}
