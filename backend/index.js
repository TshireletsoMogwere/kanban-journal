// File: backend/index.js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
// const JWT_SECRET = process.env.JWT_SECRET || "secret";

app.use(cors());
app.use(express.json());


// Middleware to authenticate JWT
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
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
  await db.execute(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, hashed]
  );
  res.json({ message: "User registered" });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  const user = rows[0];
  if (user && (await bcrypt.compare(password, user.password_hash))) {
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
  const [result] = await db.execute(
    "INSERT INTO tasks (user_id, title, due, status) VALUES (?, ?, ?, ?)",
    [req.user.id, title, due, status || "todo"]
  );
  const [task] = await db.execute("SELECT * FROM tasks WHERE id = ?", [result.insertId]);
  res.json(task[0]);
});

// Update Task
app.put("/api/tasks/:id", auth, async (req, res) => {
  const { status } = req.body;
  await db.execute("UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?", [status, req.params.id, req.user.id]);
  const [updated] = await db.execute("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
  res.json(updated[0]);
});

// Delete Task
app.delete("/api/tasks/:id", auth, async (req, res) => {
  await db.execute("DELETE FROM tasks WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
  res.json({ message: "Task deleted" });
});

// Get Journal Entries
app.get("/api/journals", auth, async (req, res) => {
  const [entries] = await db.execute("SELECT * FROM journal_entries WHERE user_id = ?", [req.user.id]);
  res.json(entries);
});

// Add Journal Entry
app.post("/api/journals", auth, async (req, res) => {
  const { content } = req.body;
  const [result] = await db.execute(
    "INSERT INTO journal_entries (user_id, content) VALUES (?, ?)",
    [req.user.id, content]
  );
  const [entry] = await db.execute("SELECT * FROM journal_entries WHERE id = ?", [result.insertId]);
  res.json(entry[0]);
});

// Quote Endpoint
app.get("/api/quote", async (req, res) => {
  try {
    const response = await fetch("https://zenquotes.io/api/random");
    const data = await response.json();
    res.json({ quote: data[0].q + " — " + data[0].a });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));