import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-violet-500 shadow px-6 md:px-20 py-4 font-sans font-semibold">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl text-black">QuickPolls</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-[20px] items-center">
          <Link
            to="/"
            className="hover:underline hover:scale-105 transition-transform text-black"
          >
            Home
          </Link>
          <Link
            to="/create"
            className="hover:underline hover:scale-105 transition-transform text-black"
          >
            Create Poll
          </Link>
          <Link
            to="/mypolls"
            className="hover:underline hover:scale-105 transition-transform text-black"
          >
            My Polls
          </Link>
          {user ? (
            <>
              <span className="text-sm text-white">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="bg-white py-1 px-5 rounded-md text-black cursor-pointer hover:bg-rose-600 hover:text-white hover:scale-95 transition-transform"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-rose-500 text-black py-1 px-5 rounded-md hover:bg-white hover:text-rose-500 hover:scale-105 transition-transform"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2.5 flex flex-col items-center gap-4 text-white bg-violet-600 p-4 rounded-lg shadow">
          <Link
            to="/"
            className="bg-blue-600 w-2xs p-2 text-center rounded-lg hover:underline hover:scale-105 transition-transform"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/create"
            className="bg-blue-600 w-2xs p-2 text-center rounded-lg hover:underline hover:scale-105 transition-transform"
            onClick={() => setMenuOpen(false)}
          >
            Create Poll
          </Link>
          <Link
            to="/mypolls"
            className="bg-blue-600 w-2xs p-2 text-center rounded-lg hover:underline hover:scale-105 transition-transform"
            onClick={() => setMenuOpen(false)}
          >
            My Polls
          </Link>
          {user ? (
            <>
              <span className="text-sm bg-blue-600 w-2xs p-2 text-center rounded-lg">Hi, {user.name}</span>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="bg-white py-1 px-5 rounded-md text-black cursor-pointer hover:bg-rose-600 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-rose-500 text-white py-1 px-5 rounded-md hover:bg-white hover:text-rose-500"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
