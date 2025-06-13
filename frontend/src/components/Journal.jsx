import React, { useState } from "react";

export function Journal() {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);

  const handleSave = () => {
    if (!entry.trim()) return;
    setEntries([...entries, { date: new Date().toLocaleDateString(), content: entry }]);
    setEntry("");
  };

  return (
    <div className="card bg-base-100 p-4 shadow">
      <h2 className="text-xl font-semibold mb-2">Daily Journal</h2>
      <textarea
        className="textarea textarea-bordered w-full mb-2"
        rows={5}
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Reflect on your day, growth, and areas to improve..."
      ></textarea>
      <button className="btn btn-secondary mb-4" onClick={handleSave}>Save Entry</button>
      <div className="space-y-2">
        {entries.map((e, i) => (
          <div key={i} className="border p-2 rounded">
            <p className="text-sm text-gray-500">{e.date}</p>
            <p>{e.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}