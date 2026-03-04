import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb, initializeDb, pool } from "./db.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ status: "API is running" });
});

app.post("/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rowCount > 0) {
      return res.status(400).json({ error: "User already exists." });
    }

    const inserted = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
      [email, password]
    );
    return res.json({ message: "Account created", userId: inserted.rows[0].id });
  } catch (error) {
    return res.status(500).json({ error: "Database error." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required." });
  }

  try {
    const result = await pool.query(
      "SELECT id, email FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const user = result.rows[0];
    return res.json({
      message: "Login success",
      user: { _id: String(user.id), email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ error: "Database error." });
  }
});

connectDb().then(async () => {
  await initializeDb();
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
});
