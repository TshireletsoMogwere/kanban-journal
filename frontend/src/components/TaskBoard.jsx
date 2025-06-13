import React, { useEffect, useState } from "react";
import TaskForm from '../components/TaskForm'
import TaskColumn from '../components/TaskColumn'
import EinsteinMatrix from '../components/EinsteinMatrix'
import axios from "axios";


export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/tasks").then((res) => setTasks(res.data));
  }, []);

  const addTask = async (task) => {
    const res = await axios.post("http://localhost:5000/api/tasks", task);
    setTasks([...tasks, res.data]);
  };

  const updateTask = async (id, updates) => {
    const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, updates);
    setTasks(tasks.map((task) => (task.id === id ? res.data : task)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    setTasks(tasks.filter((task) => task.id !== id));
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