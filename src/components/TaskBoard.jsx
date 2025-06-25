import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
  remove,
} from "firebase/database";
import { useNavigate } from "react-router-dom"; 
import { auth } from "../firebase";
import TaskForm from "../components/TaskForm";
import TaskColumn from "./TaskColoumn";
import Button from "../components/Button";

const db = getDatabase();

const columnStyles = {
  todo: "bg-red-50 border-red-300 text-red-800",
  inprogress: "bg-yellow-50 border-yellow-300 text-yellow-800",
  done: "bg-green-50 border-green-300 text-green-800",
};

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      navigate("/"); // 
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const addTask = async ({ title, due }) => {
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = ref(db, `users/${user.uid}/tasks`);
    await push(taskRef, {
      title,
      due,
      status: "todo",
      createdAt: Date.now(),
    });
  };

  const updateTask = async (taskId, updates) => {
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = ref(db, `users/${user.uid}/tasks/${taskId}`);
    await update(taskRef, updates);
  };

  const deleteTask = async (taskId) => {
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = ref(db, `users/${user.uid}/tasks/${taskId}`);
    await remove(taskRef);
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const tasksRef = ref(db, `users/${user.uid}/tasks`);
        onValue(tasksRef, (snapshot) => {
          const data = snapshot.val();
          const taskList = data
            ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
            : [];
          setTasks(taskList);
        });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-900 tracking-wide">
          Kanban Journal
        </h1>
        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Logout
        </Button>
      </div>

      <div className="max-w-lg mx-auto mb-10">
        <TaskForm addTask={addTask} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {["todo", "inprogress", "done"].map((status) => (
          <section
            key={status}
            className={`rounded-lg border p-6 shadow-sm ${columnStyles[status]}`}
          >
            <h2 className="text-2xl font-semibold mb-6 capitalize">
              {status === "todo"
                ? "To Do"
                : status === "inprogress"
                ? "In Progress"
                : "Completed"}
            </h2>

            {tasks.filter((t) => t.status === status).length === 0 ? (
              <p className="text-gray-500 italic">No tasks here yet.</p>
            ) : (
              <TaskColumn
                title=""
                tasks={tasks.filter((t) => t.status === status)}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
