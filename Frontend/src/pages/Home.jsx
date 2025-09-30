import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto text-center py-16 px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-700 mb-6">
        Welcome to QuickPolls App 
      </h1>

      <h2 className="text-lg sm:text-xl text-gray-700 mb-8">
        Create polls, share them, and see live results instantly.
      </h2>

      <h1 className="font-bold text-violet-950 text-4xl mt-14">Features</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-violet-400 text-black p-6 rounded-lg shadow hover:shadow-lg transition-transform hover:scale-105">
          <h3 className="text-lg font-semibold">✨ Easy to Use</h3>
          <p className="mt-2.5 text-sm sm:text-base">
            Create a poll in seconds with up to 4 options.
          </p>
        </div>

        <div className="bg-violet-400 text-black p-6 rounded-lg shadow hover:shadow-lg transition-transform hover:scale-105">
          <h3 className="text-lg font-semibold">📊 Live Results</h3>
          <p className="mt-2.5 text-sm sm:text-base">
            See votes update in real-time with charts.
          </p>
        </div>

        <div className="bg-violet-400 text-black p-6 rounded-lg shadow hover:shadow-lg transition-transform hover:scale-105">
          <h3 className="text-lg font-semibold">🌍 Public or Private</h3>
          <p className="mt-2.5 text-sm sm:text-base">
            Make polls open to everyone or only to registered users.
          </p>
        </div>
      </div>

      <div className="mt-14 flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/create"
          className="px-6 py-3 bg-blue-600 shadow text-white rounded-lg hover:bg-white hover:text-blue-600 border border-transparent hover:border-blue-600 transition-all"
        >
          Create a Poll
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg shadow hover:bg-blue-600 hover:text-white hover:border-white transition-all"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}


