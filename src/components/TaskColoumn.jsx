import { Trash } from "lucide-react";

export default function TaskColumn({ title, tasks, updateTask, deleteTask }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="card bg-base-100 shadow p-4">
            <h3 className="font-bold">{task.title}</h3>
            <p className="text-sm text-gray-500">
              Due: {new Date(task.due).toLocaleDateString()}
            </p>
            <select
              value={task.status}
              onChange={(e) => updateTask(task.id, { status: e.target.value })}
              className="select select-bordered w-full mt-2"
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Completed</option>
            </select>
            <button
            
              onClick={() => deleteTask(task.id)}
              className="btn btn-sm btn-error mt-2"
            >
              <Trash className="w-4 h-4"
              Delete
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

