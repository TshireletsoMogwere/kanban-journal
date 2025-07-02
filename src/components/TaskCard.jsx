import React, { useState } from "react";
import { Trash, Pencil, GripVertical } from "lucide-react";

function TaskCard({ task, updateTask, deleteTask }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize edited title and due date
  const [editedTitle, setEditedTitle] = useState(task.title || "");

  // Parse Firestore Timestamp or Date string safely, format to "yyyy-mm-dd" for <input type="date" />
  const initialDue = (() => {
    try {
      const rawDate = task.due?.toDate ? task.due.toDate() : new Date(task.due);
      return isNaN(rawDate.getTime()) ? "" : rawDate.toISOString().split("T")[0];
    } catch {
      return "";
    }
  })();
  const [editedDue, setEditedDue] = useState(initialDue);

  // Drag handlers (optional)
  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", JSON.stringify(task));
  };
  const handleDragEnd = () => setIsDragging(false);

  // Save edits and notify parent
  const handleSave = () => {
    updateTask(task.id, {
      title: editedTitle.trim(),
      due: editedDue ? editedDue : null, // pass ISO string or null
      // IMPORTANT: Convert editedDue to Firestore Timestamp in updateTask if using Firestore!
    });
    setIsEditing(false);
  };

  // Cancel edits and reset state
  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title || "");
    setEditedDue(initialDue);
  };

  // Display date for reading (parse Firestore Timestamp if needed)
  const dueDate = (() => {
    try {
      const d = task.due?.toDate ? task.due.toDate() : new Date(task.due);
      return isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  })();

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
          dueDate && (
            <p className="text-sm text-gray-500">
              Due: {dueDate.toLocaleDateString()}
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
