import express from "express";
import cors from "cors";
import { connectDb, User } from "./db.js";

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
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists." });
    }

    const user = await User.create({ email, password });
    return res.json({ message: "Account created", userId: user._id });
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
    const user = await User.findOne({ email, password }).select("_id email");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    return res.json({ message: "Login success", user });
  } catch (error) {
    return res.status(500).json({ error: "Database error." });
  }
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
});
