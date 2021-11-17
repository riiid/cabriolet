import { Pool } from "pg";

export interface PostgresDatabaseConfig {
  pool: Pool;
}
