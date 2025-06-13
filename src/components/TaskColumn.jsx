import React from "react";

export default function TaskColumn({ title, tasks, updateTask }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="card bg-base-100 shadow p-4">
            <h3 className="font-bold">{task.title}</h3>
            <p className="text-sm">Due: {task.due}</p>
            <select
              value={task.status}
              onChange={(e) => updateTask(task.id, { status: e.target.value })}
              className="select select-bordered w-full mt-2"
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}