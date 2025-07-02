import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { columnConfig } from "../config/columnConfig";

export default function TaskColumn({ title, tasks, updateTask, deleteTask, status }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const config = columnConfig[status];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const taskData = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (taskData.status !== status) {
        updateTask(taskData.id, { status });
      }
    } catch (error) {
      console.error("Error dropping task:", error);
    }
  };

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-colors ${
        isDragOver ? "border-2 border-dashed border-blue-400" : ""
      }`}
      aria-label={`${config.title} tasks column`}
      role="list"
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold text-gray-800 ${config.textColor}`}>{title}</h3>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Tasks List */}
      <div className="space-y-3 min-h-[60px]">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-400 italic text-center py-8">
            {status === "todo"
              ? "No tasks yet — add one to get started"
              : status === "in-progress"
              ? "Drag tasks here to begin"
              : ""}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          ))
        )}
      </div>
    </section>
  );
}
