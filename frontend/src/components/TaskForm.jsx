import React, { useState } from "react";

export default function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !due) return;
    addTask({ title, due, status: "todo" });
    setTitle("");
    setDue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input input-bordered" />
      <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="input input-bordered" />
      <button className="btn btn-primary">Add Task</button>
    </form>
  );
}





