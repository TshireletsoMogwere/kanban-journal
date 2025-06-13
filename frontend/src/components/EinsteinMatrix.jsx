import React from "react";

function categorize(task) {
  const dueDate = new Date(task.due);
  const today = new Date();
  const isUrgent = (dueDate - today) / (1000 * 60 * 60 * 24) <= 1;

  return {
    ...task,
    urgent: isUrgent,
    important: true,
  };
}

export default function EinsteinMatrix({ tasks }) {
  const categorized = tasks.map(categorize);
  return (
    <div className="grid grid-cols-2 gap-2 mt-8">
      {["Urgent & Important", "Not Urgent & Important", "Urgent & Not Important", "Not Urgent & Not Important"].map((label, idx) => {
        const filtered = categorized.filter(task => {
          const urgent = task.urgent;
          const important = task.important;
          if (label === "Urgent & Important") return urgent && important;
          if (label === "Not Urgent & Important") return !urgent && important;
          if (label === "Urgent & Not Important") return urgent && !important;
          return !urgent && !important;
        });

        return (
          <div key={label} className="card bg-base-100 p-4 shadow">
            <h3 className="font-bold text-lg mb-2">{label}</h3>
            {filtered.map(t => <div key={t.id}>{t.title}</div>)}
          </div>
        );
      })}
    </div>
  );
}
