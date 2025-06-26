import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

import { auth, db } from "../firebase";
import TaskForm from "../components/TaskForm";
import TaskColumn from "./TaskColoumn";
import Button from "../components/Button";
import Journal from "../components/Journal";
import LoadingSpinner from "../components/LoadingSpinner";
import EinsteinMatrix from "../components/EinsteinMatrix";
import Affirmation from "./Affirmation";

import { columnConfig } from "../config/columnConfig";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const addTask = async ({ title, due }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const taskRef = collection(db, "users", currentUser.uid, "tasks");
    await addDoc(taskRef, {
      title,
      due,
      status: "todo",
      createdAt: serverTimestamp(),
    });
  };

  const updateTask = async (taskId, updates) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const taskRef = doc(db, "users", currentUser.uid, "tasks", taskId);
    await updateDoc(taskRef, updates);
  };

  const deleteTask = async (taskId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const taskRef = doc(db, "users", currentUser.uid, "tasks", taskId);
    await deleteDoc(taskRef);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        const tasksRef = collection(db, "users", authUser.uid, "tasks");
        const q = query(tasksRef);
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const fetchedTasks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(fetchedTasks);
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);
  const totalTasks = tasks.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading your tasks..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Left Section: Logo + Text */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-white w-5 h-5" />
              </div>
              <div className="leading-tight">
                <h1 className="hidden md:block text-2xl font-bold text-gray-900">
                  Kanban Journal
                </h1>
                <p className="text-m text-gray-500">
                  {user?.email?.split("@")[0] || "User"} • {totalTasks} total
                  tasks
                </p>
              </div>
            </div>

            {/* Right Section: Logout Button */}
            <div>
              <Button
                onClick={handleLogout}
                className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors"
              >
                Logout
              </Button>

              <button
                onClick={handleLogout}
                className="md:hidden p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                title="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div>
        <Affirmation/>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Add Task */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Add New Task
            </h2>
            <p className="text-gray-500 mb-4">
              Create a task and drag it between columns
            </p>
            <TaskForm addTask={addTask} />
          </div>
        </section>

        {/* Task Columns */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(columnConfig).map(([status, config]) => (
              <TaskColumn
                key={status}
                title={config.title}
                status={status}
                tasks={getTasksByStatus(status)}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        </section>

        {/* Priority Matrix & Journal */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Priority Matrix
            </h2>
            <p className="text-gray-500 mb-4">
              Organize tasks by importance and urgency
            </p>
            <EinsteinMatrix tasks={tasks} />
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Daily Journal
            </h2>
            <Journal />
          </div>
        </section>
      </main>
    </div>
  );
}
