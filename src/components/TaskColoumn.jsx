import React, { useState } from "react";
import { Trash, ChevronRight, ArrowRight, Check, GripVertical } from "lucide-react";
import { columnConfig } from "../config/columnConfig";

function TaskCard({ task, updateTask, deleteTask }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", JSON.stringify(task));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === "todo") return "inprogress";
    if (currentStatus === "inprogress") return "done";
    return null;
  };

  const getPrevStatus = (currentStatus) => {
    if (currentStatus === "done") return "inprogress";
    if (currentStatus === "inprogress") return "todo";
    return null;
  };

  const nextStatus = getNextStatus(task.status);
  const prevStatus = getPrevStatus(task.status);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-move ${
        isDragging ? "opacity-50 rotate-2" : ""
      }`}
      aria-label={`Task: ${task.title}`}
      role="listitem"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <GripVertical className="w-4 h-4 text-gray-400" aria-hidden="true" />
          <h4 className="font-medium text-gray-800 flex-1">{task.title}</h4>
        </div>
        <button
          onClick={() => deleteTask(task.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label={`Delete task ${task.title}`}
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>

      {task.due && (
        <p className="text-sm text-gray-500 mb-3">
          Due: {new Date(task.due).toLocaleDateString()}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {prevStatus && (
            <button
              onClick={() => updateTask(task.id, { status: prevStatus })}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              title={`Move to ${columnConfig[prevStatus].title}`}
              aria-label={`Move task ${task.title} to ${columnConfig[prevStatus].title}`}
            >
              <ChevronRight className="w-4 h-4 text-gray-600 rotate-180" />
            </button>
          )}

          {nextStatus && (
            <button
              onClick={() => updateTask(task.id, { status: nextStatus })}
              className={`w-8 h-8 rounded-full ${columnConfig[nextStatus].accent} hover:opacity-80 flex items-center justify-center transition-all`}
              title={`Move to ${columnConfig[nextStatus].title}`}
              aria-label={`Move task ${task.title} to ${columnConfig[nextStatus].title}`}
            >
              {nextStatus === "done" ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <ArrowRight className="w-4 h-4 text-white" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

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
