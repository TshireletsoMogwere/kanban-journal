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
import { CheckCircle, Bell, Target, Calendar, BarChart3, BookOpen, Plus, LogOut } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <LoadingSpinner message="Loading your tasks..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Enhanced Header - keeping exact same structure */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left Section: Logo + Text - exact same structure */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="text-white w-5 h-5" />
              </div>
              <div className="leading-tight">
                <h1 className="hidden md:block text-2xl font-bold bg-gradient-to-r from-blue-50 to-indigo-100 bg-clip-text ">
                  Kanban Journal
                </h1>
                <p className="text-sm text-gray-600">
                  {user?.email?.split("@")[0] || "User"} • {totalTasks} total tasks
                </p>
              </div>
            </div>

            {/* Right Section: Logout Button - exact same structure */}
            <div className="flex items-center space-x-3">
              
             

              <Button
                onClick={handleLogout}
                className="hidden md:inline-flex bg-blue-600 hover:blue-100 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-lg hover:blue-100"
              >
                Logout
              </Button>

              <button
                onClick={handleLogout}
                className="md:hidden p-2 rounded-lg bg-blue-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all"
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

      {/* Your exact Affirmation component */}
      <div>
        <Affirmation/>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Quick Stats - just visual enhancement, using your existing data */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">To Do</p>
                <p className="text-2xl font-bold text-red-600">{getTasksByStatus("todo").length}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{getTasksByStatus("in-progress").length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{getTasksByStatus("done").length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </section>

        {/* Add Task - exact same structure, just enhanced styling */}
        <section className=" backdrop-blur-sm p-6 hover:shadow-md transition-shadow">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Plus className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Add New Task</h2>
            </div>
            <p className="text-gray-500 mb-4">
              Create a task and drag it between columns
            </p>
            <TaskForm addTask={addTask} />
          </div>
        </section>

        {/* Task Columns - exact same structure */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(columnConfig).map(([status, config]) => (
              <div key={status} className="rounded-2xl shadow-sm border p-6 bg-white/70 backdrop-blur-sm ">
                <TaskColumn
                  title={config.title}
                  status={status}
                  tasks={getTasksByStatus(status)}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Priority Matrix & Journal - exact same structure */}
       <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Priority Matrix</h2>
            </div>
            <p className="text-gray-600 mb-6">Eisenhower Decision Matrix</p>
            <EinsteinMatrix tasks={tasks} />
          </div>

          <div className="lg:col-span-3 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Daily Reflection</h2>
            </div>
            <p className="text-gray-600 mb-6">Capture your thoughts, insights, and progress</p>
            <Journal />
          </div>
        </section>
      </main>
    </div>
  );
}