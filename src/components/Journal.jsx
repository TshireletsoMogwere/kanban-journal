import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Journal() {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setEntries([]); // Clear entries if logged out
        return;
      }

      // Reference user's journal collection with ordering
      const journalRef = collection(db, "users", user.uid, "journal");
      const q = query(journalRef, orderBy("createdAt", "desc"));

      // Subscribe to realtime updates
      const unsubscribeSnap = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEntries(data);
        },
        (error) => {
          console.error("Error fetching journal entries:", error);
        }
      );

      // Cleanup listener on unmount or auth change
      return () => unsubscribeSnap();
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user || !entry.trim()) return;

    try {
      const journalRef = collection(db, "users", user.uid, "journal");
      await addDoc(journalRef, {
        content: entry.trim(),
        createdAt: serverTimestamp(),
      });
      setEntry(""); // Clear textarea after save
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
      />
      <button className="btn btn-secondary mb-4" onClick={handleSave}>
        Save Entry
      </button>

      <div className="space-y-2">
        {entries.length === 0 && (
          <p className="text-gray-500 italic">No journal entries yet.</p>
        )}
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
