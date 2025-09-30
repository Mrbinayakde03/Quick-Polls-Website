import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { io } from "socket.io-client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

export default function PollView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shareMsg, setShareMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("token");

    if (!token) {
      // if not logged in → redirect to login
      navigate(`/login?redirect=/poll/${id}`);
      return;
    }

    api
      .get(`/polls/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!mounted) return;
        setPoll(res.data.poll);
        setVoted(!!res.data.voted);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // connect socket
    socketRef.current = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    });
    socketRef.current.emit("joinPoll", id);
    socketRef.current.on("voteUpdate", (data) => {
      if (data.pollId !== id) return;
      setPoll((prev) => (prev ? { ...prev, options: data.options } : prev));
    });

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.emit("leavePoll", id);
        socketRef.current.disconnect();
      }
    };
  }, [id, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading...
      </div>
    );
  if (!poll)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-medium">
        Poll not found
      </div>
    );

  const handleVote = async (optionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate(`/login?redirect=/poll/${id}`);
        return;
      }

      const res = await api.post(
        `/polls/${id}/vote`,
        { optionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPoll(res.data.poll);
      setVoted(true);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // 📌 Share Poll
  const handleShare = async () => {
    const url = `${window.location.origin}/poll/${id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: poll.question,
          text: "Vote on my poll (login required)!",
          url,
        });
      } catch (err) {
        console.error("Share cancelled:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setShareMsg("✅ Poll link copied!");
      setTimeout(() => setShareMsg(null), 2000);
    }
  };

  const labels = poll.options.map((o) => o.text);
  const data = {
    labels,
    datasets: [
      {
        label: "Votes",
        data: poll.options.map((o) => o.votes ?? 0),
        backgroundColor: ["#3b82f6", "#f97316", "#10b981", "#e11d48"],
        borderRadius: 6,
      },
    ],
  };

  return (
    <div>
      {/* Top Actions */}
      <div className="w-[90%] flex justify-end items-center px-4 mt-11 sm:flex-row gap-3 sm:justify-end">
        <button
          className="font-medium px-4 py-4 w-fit cursor-pointer bg-purple-400 text-black rounded-lg hover:bg-purple-700 hover:text-white hover:scale-95 shadow-lg transition"
          onClick={() => (window.location.href = "/create")}
        >
          ➕ Create New Poll
        </button>
      </div>

      {/* Poll Section */}
      <div className="px-4 sm:px-6 md:px-0 mt-7 flex justify-center">
        <div className="w-full max-w-2xl bg-green-400 rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-black mb-3 text-center sm:text-left">
            {poll.question}
          </h2>
          <p className="text-gray-700 text-sm mb-6 text-center sm:text-left">
            Created at: {new Date(poll.createdAt).toLocaleString()}
          </p>

          {!voted ? (
            <div className="space-y-3 mb-6">
              {poll.options.map((opt) => (
                <button
                  key={opt._id}
                  onClick={() => handleVote(opt._id)}
                  className="w-full text-left p-3 border rounded-lg bg-white hover:bg-blue-100 transition"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-6 text-green-800 font-medium text-center sm:text-left">
              ✅ You have voted. See live results below:
            </div>
          )}

          <div className="bg-green-400 p-2 rounded-lg">
            <Bar
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Share Button */}
      <div className="flex justify-center items-center">
        <button
          onClick={handleShare}
          className="font-medium px-4 py-2 mt-6 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-700 hover:scale-95 shadow-lg transition"
        >
          📤 Share Poll
        </button>
      </div>
      {shareMsg && (
        <div className="text-center mt-3 text-green-700 font-medium">
          {shareMsg}
        </div>
      )}
    </div>
  );
}
