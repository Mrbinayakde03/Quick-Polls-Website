import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState(null);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showError = (msg) => {
    setErr(msg);
    setTimeout(() => setErr(null), 1000);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!isValidEmail(form.email)) {
      showError("Please enter a valid email address.");
      return;
    }

    try {
      await signup(form);

      // 👇 get redirect param if available
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      nav(redirect || "/"); // go to poll if provided, else go home
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your Account 🚀
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join QuickPolls and start creating polls instantly
        </p>

        {err && (
          <div className="bg-red-100 text-red-700 font-medium p-2 rounded mb-4 text-center">
            {err}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800"
          />
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800"
          />

          <button className="w-full cursor-pointer bg-sky-500 hover:bg-sky-600 hover:scale-105 text-white font-semibold py-3 rounded-lg transition duration-200">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-sky-600 font-medium hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
