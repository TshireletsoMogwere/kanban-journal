
// File: backend/index.js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Middleware to authenticate JWT
const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Register
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await db.execute("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", [name, email, hashed]);
  res.json({ message: "User registered" });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  const user = rows[0];
  if (user && await bcrypt.compare(password, user.password_hash)) {
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Get Tasks
app.get("/api/tasks", auth, async (req, res) => {
  const [tasks] = await db.execute("SELECT * FROM tasks WHERE user_id = ?", [req.user.id]);
  res.json(tasks);
});

// Add Task
app.post("/api/tasks", auth, async (req, res) => {
  const { title, due, status } = req.body;
  await db.execute("INSERT INTO tasks (user_id, title, due_date, status) VALUES (?, ?, ?, ?)", [req.user.id, title, due, status || "todo"]);
  res.json({ message: "Task added" });
});

// Update Task
app.put("/api/tasks/:id", auth, async (req, res) => {
  const { status } = req.body;
  await db.execute("UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?", [status, req.params.id, req.user.id]);
  res.json({ message: "Task updated" });
});

// Get Journal Entries
app.get("/api/journal", auth, async (req, res) => {
  const [entries] = await db.execute("SELECT * FROM journal_entries WHERE user_id = ?", [req.user.id]);
  res.json(entries);
});

// Add Journal Entry
app.post("/api/journal", auth, async (req, res) => {
  const { content } = req.body;
  await db.execute("INSERT INTO journal_entries (user_id, content) VALUES (?, ?)", [req.user.id, content]);
  res.json({ message: "Journal saved" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
