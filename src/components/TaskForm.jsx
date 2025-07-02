import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Plus, AlertCircle } from 'lucide-react';

export default function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState(null); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !due) {
      setError("Please enter both a title and due date.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await addTask({ title: title.trim(), due, status: "todo" });

      setTitle("");
      setDue(null); 
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
  <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-xl shadow-l border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-400 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Plus size={20} />
            Add New Task
          </h2>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Task Title Input */}
          <div className="space-y-2">
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700">
              Task Title
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="Enter your task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors duration-200 placeholder-gray-400 text-gray-800 text-center"
              autoFocus
            />
          </div>

          {/* Due Date Input */}
          <div className="space-y-2">
            <label htmlFor="due-date" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <DatePicker
              showIcon
              toggleCalendarOnIconClick={true}
              selected={due}
              onChange={(date) => setDue(date)}
              minDate={new Date()}
              placeholderText="Select due date"
              className="w-full px-12 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors duration-200 placeholder-gray-400 text-gray-800 text-center"
              icon={
                <Calendar size={18} className="text-gray-400" />
              }
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !title.trim()}
            onClick={handleSubmit}
            className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              loading || !title.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Adding Task...
              </>
            ) : (
              <>
                <Plus size={18} />
                Add Task
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Animation Area */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Fill in the details above to create your task
        </p>
      </div>
    </div>
  );
}