// import React, { useEffect, useState } from "react";
// import api from "../api/api";
// import { Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// export default function MyPolls() {
//   const { user } = useAuth();
//   const [polls, setPolls] = useState([]);

//   useEffect(() => {
//     if (!user) return;
//     api
//       .get("/polls")
//       .then((res) => setPolls(res.data.polls))
//       .catch(console.error);
//   }, [user]);

//   if (!user)
//     return (
//       <div className="max-w-md mx-auto mt-20 text-center p-5 bg-gray-50 rounded shadow-xl">
//         Login to see your polls.
//       </div>
//     );

//   return (
//     <div className="max-w-2xl mx-auto mt-14 bg-cyan-100 p-10 rounded-2xl shadow-2xl hover:scale-105 transition-transform">
//       <h2 className="text-xl font-semibold mb-3">My Polls</h2>
//       {polls.length === 0 && (
//         <div>
//           No polls yet.{" "}
//           <Link to="/create" className="text-blue-600">
//             Create one
//           </Link>
//         </div>
//       )}
//       <ul className="space-y-3">
//         {polls.map((p) => (
//           <li
//             key={p._id}
//             className="p-3 border rounded-2xl flex justify-between items-center bg-white shadow"
//           >
//             <div>
//               <div className="font-medium mb-2">{p.question}</div>
//               <div className="text-sm text-gray-600">
//                 {p.options.length} options • {p.isPublic ? "Public" : "Private"}
//               </div>
//             </div>
//             <Link to={`/poll/${p._id}`} className="text-blue-600">
//               Open
//             </Link>
//           </li>
//         ))}
//       </ul>
//       <div className="mt-6 px-4 py-2 w-fit cursor-pointer ml-52 bg-purple-400 text-black rounded-lg hover:bg-purple-700 hover:text-white hover:scale-95 shadow-lg transition">
//         <button className="font-medium cursor-pointer"
//         onClick={() => window.location.href = '/create'}
//         >
//           ➕ Create New Poll
//         </button>
//       </div>
//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function MyPolls() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    if (!user) return;
    api
      .get("/polls")
      .then((res) => setPolls(res.data.polls))
      .catch(console.error);
  }, [user]);

  if (!user)
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-5 bg-gray-50 rounded shadow-md">
        Login to see your polls.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-16 p-6 sm:p-8 bg-cyan-100 rounded-2xl shadow-2xl transition-transform hover:scale-105 duration-300">
      <h2 className="text-xl sm:text-3xl font-semibold mb-5 text-center sm:text-left">
        My Polls
      </h2>

      {polls.length === 0 ? (
        <div className="text-center sm:text-left text-gray-700">
          No polls yet.{" "}
          <Link
            to="/create"
            className="text-blue-600 cursor-pointer font-medium hover:underline"
          >
            Create one
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {polls.map((p) => (
            <li
              key={p._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 border rounded-2xl bg-white shadow hover:shadow-md transition duration-200"
            >
              <div className="mb-2 sm:mb-0">
                <div className="font-medium text-lg">{p.question}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {p.options.length} options • {p.isPublic ? "Public" : "Private"}
                </div>
              </div>
              <Link
                to={`/poll/${p._id}`}
                className="text-blue-600 font-medium mt-2 sm:mt-0 hover:underline"
              >
                Open
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex justify-center sm:justify-start">
        <button
          onClick={() => window.location.href = '/create'}
          className="flex items-center gap-2 bg-purple-400 text-black px-5 py-2 rounded-lg hover:bg-purple-600 hover:text-white transition transform hover:scale-95 shadow-md font-medium"
        >
          ➕ Create New Poll
        </button>
      </div>
    </div>
  );
}
