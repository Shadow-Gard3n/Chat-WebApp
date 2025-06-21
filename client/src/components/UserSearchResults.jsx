import React from "react";

function UserSearchResults({ results, getRequestStatus, onSendRequest }) {
  return (
    <div className="absolute mt-2 w-full bg-slate-900/90 rounded-xl shadow-xl z-30 overflow-y-auto max-h-64 border border-slate-700 backdrop-blur-sm">
      {results.map((user, index) => {
        const status = getRequestStatus(user.username);
        return (
          <div
            key={index}
            className="flex justify-between items-center px-4 py-3 hover:bg-slate-800 transition duration-200"
          >
            <span className="text-white text-sm font-medium">
              {user.username}
            </span>

            {status ? (
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  status === "pending"
                    ? "bg-yellow-400 text-black"
                    : status === "accepted"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            ) : (
              <button
                onClick={() => onSendRequest(user.username)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold px-3 py-1 rounded-full transition duration-200"
              >
                Send Request
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default UserSearchResults;
