import pg from "pg";

const { Pool } = pg;

const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/movie_dashboard";

const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

export async function connectDb() {
  try {
    const client = await pool.connect();
    client.release();
    console.log("PostgreSQL connected");
  } catch (error) {
    console.error("PostgreSQL connection error:", error.message);
    process.exit(1);
  }
}

export async function initializeDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  } catch (error) {
    console.error("PostgreSQL init error:", error.message);
    process.exit(1);
  }
}
