const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get all journal entries
router.get("/", async (req, res) => {
  try {
    const [entries] = await pool.query("SELECT * FROM journal_entries ORDER BY created_at DESC");
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add journal entry
router.post("/", async (req, res) => {
  const { user_id, content } = req.body;
  if (!user_id || !content) return res.status(400).json({ message: "Missing user_id or content" });

  try {
    const [result] = await pool.query(
      "INSERT INTO journal_entries (user_id, content, created_at) VALUES (?, ?, NOW())",
      [user_id, content]
    );
    const [newEntry] = await pool.query("SELECT * FROM journal_entries WHERE id = ?", [result.insertId]);
    res.status(201).json(newEntry[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update journal entry
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { content } = req.body;

  try {
    await pool.query("UPDATE journal_entries SET content = ? WHERE id = ?", [content, id]);
    const [updatedEntry] = await pool.query("SELECT * FROM journal_entries WHERE id = ?", [id]);
    res.json(updatedEntry[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete journal entry
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM journal_entries WHERE id = ?", [id]);
    res.json({ message: "Journal entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
