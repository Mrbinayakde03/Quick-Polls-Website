import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../pages/Navbar";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import CreatePoll from "../pages/CreatePoll";
import MyPolls from "../pages/MyPolls";
import PollView from "../pages/PollView";
import Home from "../pages/Home";

function AppRoutes() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/mypolls" element={<MyPolls />} />
        <Route path="/poll/:id" element={<PollView />} />
      </Routes>
    </div>
  );
}

export default AppRoutes;
