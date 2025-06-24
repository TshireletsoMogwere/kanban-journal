import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Journal() {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const journalRef = collection(db, "users", user.uid, "journal");
      const snapshot = await getDocs(journalRef);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Optional: sort by newest
      data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setEntries(data);
    } catch (error) {
      console.error("Error loading journal entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user || !entry.trim()) return;

    const newEntry = {
      content: entry,
      createdAt: serverTimestamp(),
    };

    try {
      const journalRef = collection(db, "users", user.uid, "journal");
      const docRef = await addDoc(journalRef, newEntry);
      setEntries((prev) => [
        { id: docRef.id, ...newEntry, createdAt: new Date() },
        ...prev,
      ]);
      setEntry("");
    } catch (error) {
      console.error("Error saving journal entry:", error);
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
          <div key={e.id} className="border p-2 rounded">
            <p className="text-sm text-gray-500">
              {e.createdAt?.toDate
                ? e.createdAt.toDate().toLocaleString()
                : "Just now"}
            </p>
            <p>{e.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
