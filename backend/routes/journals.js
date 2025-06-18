const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.use(authMiddleware); // protect all journal routes

// Get all journal entries for logged-in user
router.get("/", async (req, res) => {
  try {
    const user_id = req.user.id;
    const [entries] = await pool.query(
      "SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add journal entry for logged-in user
router.post("/", async (req, res) => {
  const user_id = req.user.id;
  const { content } = req.body;

  if (!content) return res.status(400).json({ message: "Missing content" });

  try {
    const [result] = await pool.query(
      "INSERT INTO journal_entries (user_id, content, created_at) VALUES (?, ?, NOW())",
      [user_id, content]
    );
    const [newEntry] = await pool.query(
      "SELECT * FROM journal_entries WHERE id = ?",
      [result.insertId]
    );
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
    await pool.query("UPDATE journal_entries SET content = ? WHERE id = ?", [
      content,
      id,
    ]);
    const [updatedEntry] = await pool.query(
      "SELECT * FROM journal_entries WHERE id = ?",
      [id]
    );
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
