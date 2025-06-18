import React, { useState } from "react";

export default function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !due) {
      setError("Please enter both a title and due date.");
      return;
    }
    setError("");
    addTask({ title: title.trim(), due, status: "todo" });
    setTitle("");
    setDue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered"
      />
      <input
        type="date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        className="input input-bordered"
        min={new Date().toISOString().split("T")[0]}
      />
      <button className="btn btn-primary">Add Task</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}





