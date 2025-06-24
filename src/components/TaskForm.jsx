import React, { useState } from "react";

export default function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !due) {
      setError("Please enter both a title and due date.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await addTask({ title: title.trim(), due, status: "todo" });

      setTitle("");
      setDue("");
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
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
      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
