import React, { useEffect, useState } from "react";

export default function Journal() {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);


  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/journals", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch journal entries");

        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error("Fetch error:", err.message);
      }
    };

    fetchEntries();
  }, []);

  const handleSave = async () => {
  if (!entry.trim()) return;

  try {
    const res = await fetch("http://localhost:5000/api/journals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({  content: entry }),

    });

    if (!res.ok) throw new Error("Failed to save journal entry");

    const savedEntry = await res.json();
    setEntries([...entries, savedEntry]);
    setEntry("");
  } catch (err) {
    console.error("Save error:", err.message);
  }
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
      <button className="btn btn-secondary mb-4" onClick={handleSave}>
        Save Entry
      </button>

      <div className="space-y-2">
        {entries.map((e) => (
          <div key={e.id || e._id || e.date} className="border p-2 rounded">
            <p className="text-sm text-gray-500">
              {new Date(e.created_at || e.date).toLocaleString()}
            </p>
            <p>{e.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
