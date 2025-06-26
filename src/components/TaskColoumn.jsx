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
      className={`bg-gradient-to-b ${config.gradient} rounded-2xl border-2 p-6 transition-all duration-300 ${
        isDragOver ? "border-dashed border-blue-400 bg-blue-50" : config.borderColor
      }`}
      aria-label={`${config.title} tasks column`}
      role="list"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${config.textColor}`}>{title}</h3>
      </div>

      <div className="space-y-4 min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <p className="text-gray-500 font-medium mb-2">No tasks yet</p>
            <p className="text-sm text-gray-400">
              {status === "todo"
                ? "Add your first task to get started"
                : status === "inprogress"
                ? "Drag tasks here or click the arrow"
                : "Completed tasks will appear here"}
            </p>
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
