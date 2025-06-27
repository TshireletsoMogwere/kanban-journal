import React, { useState, useEffect } from "react";

function categorize(task) {
  const today = new Date();
  const dueDate = task.due ? new Date(task.due) : null;

  if (!dueDate || isNaN(dueDate)) return { ...task, urgent: false, important: false };

  const diffDays = (dueDate - today) / (1000 * 60 * 60 * 24);
  const urgent = diffDays <= 5;       
  const important = diffDays <= 14;     

  return { ...task, urgent, important };
}

const categories = [
  "Urgent & Important",
  "Not Urgent & Important",
  "Urgent & Not Important",
  "Not Urgent & Not Important",
];

export default function EinsteinMatrix({ tasks }) {
  // State that changes every minute to trigger re-render
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(Date.now());
    }, 60 * 1000); // every 1 minute

    return () => clearInterval(interval);
  }, []);
console.log(tick);
  const activeTasks = tasks.filter((task) => task.status !== "done");
  const categorized = activeTasks.map(categorize);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      {categories.map((label) => {
        const filtered = categorized.filter((task) => {
          const { urgent, important } = task;
          if (label === "Urgent & Important") return urgent && important;
          if (label === "Not Urgent & Important") return !urgent && important;
          if (label === "Urgent & Not Important") return urgent && !important;
          return !urgent && !important;
        });

        return (
          <div
            key={label}
            className="card bg-base-100 shadow p-4 border border-base-300"
          >
            <h3 className="font-bold text-lg mb-2">{label}</h3>
            {filtered.length === 0 ? (
              <p className="text-gray-400 italic">No tasks here</p>
            ) : (
              <ul className="space-y-1">
                {filtered.map((task) => (
                  <li key={task.id} className="text-sm">
                    • {task.title}
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
