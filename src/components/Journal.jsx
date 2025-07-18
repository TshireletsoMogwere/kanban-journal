import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { Pencil, Trash } from "lucide-react";

export default function Journal() {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // <-- error state

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const journalRef = collection(db, "users", user.uid, "journal");
    const q = query(journalRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading journal entries:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!entry.trim()) {
      setError("Please fill in this field");
      return;
    }

    setError("");
    const user = auth.currentUser;
    if (!user) return;

    try {
      if (editId) {
        const entryDoc = doc(db, "users", user.uid, "journal", editId);
        await updateDoc(entryDoc, {
          content: entry,
          updatedAt: serverTimestamp(),
        });
        setEditId(null);
      } else {
        const journalRef = collection(db, "users", user.uid, "journal");
        await addDoc(journalRef, {
          content: entry,
          createdAt: serverTimestamp(),
        });
      }
      setEntry("");
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
  };

  const handleEdit = (id, content) => {
    setEntry(content);
    setEditId(id);
    setError(""); // Clear error when editing
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this journal entry?")) {
      return;
    }
    const user = auth.currentUser;
    if (!user) return;
    try {
      const entryDoc = doc(db, "users", user.uid, "journal", id);
      await deleteDoc(entryDoc);
      if (editId === id) {
        setEditId(null);
        setEntry("");
        setError("");
      }
    } catch (error) {
      console.error("Error deleting journal entry:", error);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-4">Loading journal entries...</p>
    );

  return (
    <>
      <div className="space-y-4">
        <textarea
          className={`w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? "border-red-500" : "border-black"
          }`}
          rows={5}
          value={entry}
          onChange={(e) => {
            setEntry(e.target.value);
            if (error) setError(""); // Clear error on typing
          }}
          placeholder="Reflect on your day, progress and growth"
          aria-label="Journal entry"
        />
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="flex space-x-3 mb-6">
          <button className="btn btn-secondary" onClick={handleSave}>
            {editId ? "Update Entry" : "Save Entry"}
          </button>
          {editId && (
            <button
              className="btn btn-outline"
              onClick={() => {
                setEntry("");
                setEditId(null);
                setError("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {entries.length === 0 && (
          <p className="italic text-gray-500">No journal entries yet.</p>
        )}
        {entries.map((e) => (
          <div
            key={e.id}
            className="border p-4 rounded-lg relative hover:shadow-lg transition-shadow"
          >
            <p className="text-sm text-gray-400 mb-2 select-none">
              {e.updatedAt?.toDate
                ? e.updatedAt.toDate().toLocaleString()
                : e.createdAt?.toDate
                ? e.createdAt.toDate().toLocaleString()
                : "Just now"}
            </p>
            <p className="whitespace-pre-wrap mb-4">{e.content}</p>

            <div className="absolute top-3 right-3 flex space-x-2">
              <button
                onClick={() => handleEdit(e.id, e.content)}
                className="btn btn-sm btn-info"
                title="Edit entry"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(e.id)}
                className="btn btn-sm btn-error"
                title="Delete entry"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
