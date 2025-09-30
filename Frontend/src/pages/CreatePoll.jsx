import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function CreatePoll() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isPublic, setIsPublic] = useState(true);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  const setOption = (i, v) => {
    const arr = [...options];
    arr[i] = v;
    setOptions(arr);
  };

  const addOption = () => {
    if (options.length < 4) setOptions([...options, ""]);
  };
  const removeOption = (i) => {
    setOptions(options.filter((_, idx) => idx !== i));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const filtered = options.map((o) => o.trim()).filter(Boolean);
      if (!question.trim() || filtered.length < 2)
        return setErr("Add question and at least 2 options");

      const res = await api.post("/polls", {
        question,
        options: filtered,
        isPublic,
      });

      setSuccess("🎉 Poll created successfully!");
      setErr(null);

      setTimeout(() => {
        nav(`/poll/${res.data.poll._id}`);
      }, 1000);
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    }
  };

  if (!user)
    return (
      <div className="max-w-md mx-auto mt-20 p-6 text-center bg-gray-50 rounded-xl shadow-md">
        <p className="text-gray-700 font-medium">
          Please login to create polls !!..
        </p>
        <a href="/login" className="underline text-blue-500 font-medium">Login</a>
      </div>
    );

  return (
    <div className="px-4 sm:px-6 md:px-0 mt-16 flex justify-center">
      <div className="w-full max-w-lg bg-gradient-to-br from-blue-200 to-blue-300 p-6 sm:p-8 rounded-2xl shadow-xl hover:scale-105 transition-transform">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Create a Poll 🗳️
        </h2>

        {err && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm text-center">
            {err}
          </div>
        )}
        {success && (
          <div className="mb-3 p-2 bg-green-100 text-green-700 rounded text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Question</label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your poll question"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Options</label>
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={opt}
                  onChange={(e) => setOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 text-gray-800"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {options.length < 4 && (
              <button
                type="button"
                onClick={addOption}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                ➕ Add Option
              </button>
            )}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span className="text-gray-700">Public Poll</span>
            </label>
          </div>

          <button className="w-full py-3 cursor-pointer bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
            Create Poll
          </button>
        </form>
      </div>
    </div>
  );
}
