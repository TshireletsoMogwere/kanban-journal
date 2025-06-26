import React, { useState } from "react";
import { Trash, Pencil, ChevronRight, ArrowRight, Check, GripVertical } from "lucide-react";

function TaskCard({ task, updateTask, deleteTask }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDue, setEditedDue] = useState(task.due ? task.due.split("T")[0] : "");

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", JSON.stringify(task));
  };

  const handleDragEnd = () => setIsDragging(false);

  const handleSave = () => {
    // Save both title and due date (due date as ISO string or null if empty)
    updateTask(task.id, {
      title: editedTitle.trim(),
      due: editedDue ? new Date(editedDue).toISOString() : null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
    setEditedDue(task.due ? task.due.split("T")[0] : "");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-move ${
        isDragging ? "opacity-50 rotate-2" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 w-full">
          <GripVertical className="w-4 h-4 text-gray-400" />
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              aria-label="Edit task title"
            />
          ) : (
            <>
              <h4 className="font-medium text-gray-800 flex-1">{task.title}</h4>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-blue-600"
                title="Edit task"
                aria-label="Edit task"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </>
          )}
     

        <button
          onClick={() => deleteTask(task.id)}
          className="text-gray-400 hover:text-red-500 transition-colors ml-2"
          aria-label={`Delete task ${task.title}`}
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
         </div>

      <div className="mb-3">
        {isEditing ? (
          <input
            type="date"
            value={editedDue}
            onChange={(e) => setEditedDue(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
            aria-label="Edit due date"
          />
        ) : (
          task.due && (
            <p className="text-sm text-gray-500">
              Due: {new Date(task.due).toLocaleDateString()}
            </p>
          )
        )}
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="text-blue-600 hover:underline text-sm"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
