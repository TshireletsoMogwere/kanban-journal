const db = require('../db');

exports.getJournals = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM journals WHERE user_id = ?', [req.user.id]);
  res.json(rows);
};

exports.createJournal = async (req, res) => {
  const { content, mood } = req.body;
  await db.query('INSERT INTO journals (content, mood, user_id) VALUES (?, ?, ?)', [
    content, mood, req.user.id
  ]);
  res.json({ message: 'Journal entry added' });
};
