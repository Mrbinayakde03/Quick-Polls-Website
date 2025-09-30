import React, { useState } from "react";
import { useLocation } from "react-router";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect");
      nav(redirect || "/mypolls");
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-10 hover:scale-105 transition-transform ">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Please login to continue
        </p>

        {/* Error */}
        {err && (
          <div className="bg-red-100 text-red-700 font-medium p-2 rounded mb-4 text-center">
            {err}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-800"
          />
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-800"
          />

          {/* Submit */}
          <button className="w-full cursor-pointer bg-violet-600 hover:bg-violet-700 hover:scale-95 text-white font-semibold py-3 rounded-lg transition duration-200">
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to={`/signup${location.search}`} 
            className="text-violet-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
