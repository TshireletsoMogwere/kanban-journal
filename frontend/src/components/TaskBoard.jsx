import React, { useState } from "react";
import TaskForm from "./TaskForm";
import TaskColumn from "./TaskColumn";
import EinsteinMatrix from "./EinsteinMatrix";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  };

  return (
    <div>
      <TaskForm addTask={addTask} />
      <div className="grid grid-cols-3 gap-4 my-4">
        <TaskColumn title="To Do" tasks={tasks.filter(t => t.status === "todo")} updateTask={updateTask} />
        <TaskColumn title="In Progress" tasks={tasks.filter(t => t.status === "inprogress")} updateTask={updateTask} />
        <TaskColumn title="Completed" tasks={tasks.filter(t => t.status === "done")} updateTask={updateTask} />
      </div>
      <EinsteinMatrix tasks={tasks} />
    </div>
  );
}
