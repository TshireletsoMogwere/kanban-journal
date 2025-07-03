import React, { useState, useEffect, useMemo } from "react";

// Categorize tasks based on due date
function categorize(task, tick) {
  const now = new Date(tick);

  // Support Firestore Timestamp or ISO string
  const dueDate = task.due?.toDate ? task.due.toDate() : new Date(task.due);

  if (!dueDate || isNaN(dueDate)) {
    return { ...task, urgent: false, important: false };
  }

  const diffDays = (dueDate - now) / (1000 * 60 * 60 * 24);

  const urgent = diffDays <= 1;
  const important = diffDays <= 7;

  return { ...task, urgent, important };
}

// Labels + styles for each quadrant
const quadrantConfig = [
  {
    label: "Urgent & Important",
    note: "Do First",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    subtext: "text-red-600",
  },
  {
    label: "Important & Not Urgent",
    note: "Schedule",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    subtext: "text-blue-600",
  },
  {
    label: "Urgent & Not Important",
    note: "Delegate",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-800",
    subtext: "text-yellow-600",
  },
  {
    label: "Not Urgent & Not Important",
    note: "Eliminate",
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-800",
    subtext: "text-gray-600",
  },
];

export default function EinsteinMatrix({ tasks }) {
  const [tick, setTick] = useState(Date.now());

  // Force refresh every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(Date.now());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter out completed tasks
  const activeTasks = tasks.filter((task) => task.status !== "done");

  // Categorize tasks with tick
  const categorized = useMemo(() => {
    return activeTasks.map((task) => categorize(task, tick));
  }, [activeTasks, tick]);

  return (
    <div className="grid grid-cols-2 gap-2 mt-4 ">
      <span style={{ display: "none" }}>{tick}</span> {/* ensures re-render */}

      {quadrantConfig.map(({ label, note, bg, border, text, subtext }) => {
        const filtered = categorized.filter(({ urgent, important }) => {
          if (label === "Urgent & Important") return urgent && important;
          if (label === "Important & Not Urgent") return !urgent && important;
          if (label === "Urgent & Not Important") return urgent && !important;
          return !urgent && !important;
        });

        return (
          
          <div key={label} className={`${bg} ${border} rounded-lg p-3 border max-h-24 overflow-y-auto `}>
            <h4 className={`text-xs font-medium mb-2 ${text}`}>{label}</h4>
            <div className={`text-xs mb-2 ${subtext}`}>{note}</div>

            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No tasks here</p>
            ) : (
              <ul className="text-xs list-disc list-inside space-y-1 ">
                {filtered.map((task) => (
                  <li key={task.id} className="text-gray-700">
                    {task.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
