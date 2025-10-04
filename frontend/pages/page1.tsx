// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { BookOpen, GraduationCap, Leaf, LogOut } from "lucide-react";

export default function DashboardPage() {
  const [active, setActive] = useState("overview");
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-100 to-purple-200">
      {/* Sidebar */}
      <div className="w-64 bg-white/40 backdrop-blur-lg shadow-xl p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-pink-700 mb-8">🌱 KOFTI</h1>
        <nav className="flex flex-col gap-4">
          <button
            onClick={() => setActive("overview")}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
              active === "overview"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                : "text-gray-700 hover:bg-pink-100"
            }`}
          >
            <BookOpen size={20} /> Overview
          </button>
          <button
            onClick={() => setActive("courses")}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
              active === "courses"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                : "text-gray-700 hover:bg-pink-100"
            }`}
          >
            <GraduationCap size={20} /> Courses
          </button>
          <button
            onClick={() => setActive("sustainability")}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
              active === "sustainability"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                : "text-gray-700 hover:bg-pink-100"
            }`}
          >
            <Leaf size={20} /> Sustainability
          </button>
        </nav>
        <div className="mt-auto">
          <button className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-red-100">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">
          {active === "overview" && "Dashboard Overview"}
          {active === "courses" && "Your Courses"}
          {active === "sustainability" && "Sustainability Progress"}
        </h2>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Example Card */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-pink-700 mb-2">
              🌾 Sustainable Farming
            </h3>
            <p className="text-gray-600 text-sm">
              Learn eco-friendly farming techniques and improve productivity.
            </p>
            <button 
              onClick={() => handleNavigation('/articles/liste')}
              className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-md hover:opacity-90 transition-opacity"
            >
              Explore →
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-pink-700 mb-2">
              📚 Educational Resources
            </h3>
            <p className="text-gray-600 text-sm">
              Access articles, videos, and interactive learning modules.
            </p>
            <button 
              onClick={() => handleNavigation('/articles externes')}
              className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-md hover:opacity-90 transition-opacity"
            >
              Access →
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-pink-700 mb-2">
              🎯 Progress Tracking
            </h3>
            <p className="text-gray-600 text-sm">
              Monitor your learning and achievements on sustainability.
            </p>
            <button className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-md hover:opacity-90">
              View →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}