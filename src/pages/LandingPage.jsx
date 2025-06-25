import React, { useState } from "react";
import {
  CheckCircle,
  Calendar,
  Target,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

export default function KanbanJournalLanding() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Daily Affirmations",
      description:
        "Start each day with positive affirmations to set the right mindset",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Task Boards",
      description:
        "Organize your tasks with intuitive Kanban boards for better productivity",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Eisenhower Matrix",
      description:
        "Prioritize tasks using the proven Eisenhower Matrix methodology",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Reflection Journal",
      description:
        "Track your progress and identify areas for improvement through journaling",
    },
  ];

  // Callback after successful login to redirect
  const handleLoginSuccess = () => {
    navigate("/taskboard");
  };

  if (showLogin) {
    return (
      <AuthForm
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        onSuccess={handleLoginSuccess}
        onCancel={() => setShowLogin(false)}
      />
    );
  }

  // Landing page view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Kanban Journal
            </span>
          </div>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Organize Your Life with <br></br>
            <span className="text-blue-600 block">Kanban Journal</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Combine the power of Kanban boards with daily affirmations and
            reflective journaling to boost productivity and personal growth.
          </p>
        </div>

        {/* Feature grid */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Kanban Journal Works
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        {/* <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Kanban Journal Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {['Start Your Day', 'Organize Tasks', 'Reflect & Grow'].map((title, i) => (
              <div key={i}>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">
                  {i === 0 && 'Begin with daily affirmations to set a positive mindset'}
                  {i === 1 && 'Use Kanban boards and Eisenhower Matrix to prioritize'}
                  {i === 2 && 'End with journaling to track progress and improvements'}
                </p>
              </div>
            ))}
          </div>
        </div> */}

        {/* CTA */}
        <div className="text-center bg-blue-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Be among the first to improve your daily routine.
          </p>
          <button
            onClick={() => {
              setShowLogin(true);
              setIsLogin(false);
            }}
            className="bg-white text-blue-600 px-8 py-3 rounded-md hover:bg-gray-100 font-semibold"
          >
            Start Your Journey Today
          </button>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>
          &copy; 2025 Kanban Journal. Built for productivity and personal
          growth.
        </p>
      </footer>
    </div>
  );
}
