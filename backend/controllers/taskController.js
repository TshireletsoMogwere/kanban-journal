const db = require('../db');

exports.getTasks = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
  res.json(rows);
};

exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  await db.query('INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)', [
    title, description, req.user.id
  ]);
  res.json({ message: 'Task created' });
};

exports.updateTask = async (req, res) => {
  const { title, description, status } = req.body;
  const taskId = req.params.id;
  await db.query('UPDATE tasks SET title=?, description=?, status=? WHERE id=? AND user_id=?', [
    title, description, status, taskId, req.user.id
  ]);
  res.json({ message: 'Task updated' });
};
