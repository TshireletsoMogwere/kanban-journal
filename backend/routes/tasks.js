const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get all tasks (no auth)
router.get("/", async (req, res) => {
  try {
    const [tasks] = await pool.query("SELECT * FROM tasks");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add task
router.post("/", async (req, res) => {
  const { user_id, title, due_date, status } = req.body;
  if (!user_id || !title) return res.status(400).json({ message: "Missing user_id or title" });

  try {
    const [result] = await pool.query(
      "INSERT INTO tasks (user_id, title, due_date, status) VALUES (?, ?, ?, ?)",
      [user_id, title, due_date || null, status || "todo"]
    );
    const [newTask] = await pool.query("SELECT * FROM tasks WHERE id = ?", [result.insertId]);
    res.status(201).json(newTask[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update task
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { title, due_date, status } = req.body;

  try {
    await pool.query(
      "UPDATE tasks SET title = ?, due_date = ?, status = ? WHERE id = ?",
      [title, due_date, status, id]
    );
    const [updatedTask] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
    res.json(updatedTask[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
