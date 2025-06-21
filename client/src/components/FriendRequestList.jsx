import React from "react";

function FriendRequestList({ requests, onAccept, onReject }) {
  return (
    <div className="absolute left-0 mt-2 w-full max-w-xl bg-slate-900 bg-opacity-90 backdrop-blur-md rounded-xl shadow-2xl z-40 p-4 text-white max-h-80 overflow-y-auto border border-slate-700">
      <h3 className="text-lg font-semibold mb-4 border-b border-slate-600 pb-2 text-cyan-400">
        Friend Requests
      </h3>

      {requests.length > 0 ? (
        requests.map((req) => (
          <div
            key={req._id}
            className="flex justify-between items-center px-2 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            <span className="text-white font-medium">{req.from}</span>

            <div className="space-x-2">
              {req.status === "pending" ? (
                <>
                  <button
                    onClick={() => onAccept(req._id)}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onReject(req._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full transition"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    req.status === "accepted"
                      ? "bg-green-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-400 text-center">No new requests</p>
      )}
    </div>
  );
}

export default FriendRequestList;
