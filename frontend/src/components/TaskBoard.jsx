import React, { useEffect, useState } from "react";
import TaskForm from '../components/TaskForm';
import TaskColumn from '../components/TaskColumn';
import EinsteinMatrix from '../components/EinsteinMatrix';


export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
useEffect(() => {
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks");
      const data = await res.json();
      setTasks(data);
      console.log("Tasks fetched:", data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  fetchTasks();
}, []);

const addTask = async (task) => {
  try {
    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add task");
    }

    const data = await res.json();
    setTasks(prevTasks => [...prevTasks, data]);
  } catch (err) {
    console.error("Add task error:", err.message);
  }
};



const updateTask = async (id, updates) => {
  try {
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update task");
    }

    const data = await res.json();
    setTasks(prevTasks => prevTasks.map(task => (task.id === id ? data : task)));
  } catch (err) {
    console.error("Update task error:", err.message);
  }
};

const deleteTask = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete task");
    }

    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  } catch (err) {
    console.error("Delete task error:", err.message);
  }
};

  return (
    <div>
      <TaskForm addTask={addTask} />
      <div className="grid grid-cols-3 gap-4 my-4">
        <TaskColumn title="To Do" tasks={tasks.filter(t => t.status === "todo")} updateTask={updateTask} deleteTask={deleteTask} />
        <TaskColumn title="In Progress" tasks={tasks.filter(t => t.status === "inprogress")} updateTask={updateTask} deleteTask={deleteTask} />
        <TaskColumn title="Completed" tasks={tasks.filter(t => t.status === "done")} updateTask={updateTask} deleteTask={deleteTask} />
      </div>
      <EinsteinMatrix tasks={tasks} />
    </div>
  );
}
