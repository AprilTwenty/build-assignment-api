// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:unknow88B@localhost:5432/SchoolTestDB",
});

export default connectionPool;
