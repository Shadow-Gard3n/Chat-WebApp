import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchWithAuth } from "../utils/Api";
import { jwtDecode } from "jwt-decode";
import { Search, User, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

function Home() {
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

  const username = useMemo(() => {
    return accessToken ? jwtDecode(accessToken)?.username : "";
  }, [accessToken]);

  const getRequestStatus = (toUsername) => {
    const sent = sentRequests.find((req) => req.to === toUsername);
    if (sent) return sent.status;
    return null;
  };

  const getRequests = () => {
    setShowRequests((prev) => !prev);
  };

  const handleRequestStatus = async (requestId, status) => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:3500/api/user/friend-request/${requestId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: status }),
        },
        accessToken,
        setAccessToken
      );

      if (!res.ok) throw new Error("Failed to accept request");

      const data = await res.json();
      console.log(data);
      await fetchFriendRequests();
      await fetchFriends();
    } catch (err) {
      console.error("Error accepting request:", err.message);
    }
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const SearchQuery = async (e) => {
    if (e.key === "Enter") {
      try {
        const res = await fetchWithAuth(
          `http://localhost:3500/api/user/search?username=${query}`,
          { method: "GET" },
          accessToken,
          setAccessToken
        );
        const data = await res.json();
        console.log(data);
        const filtered = data.filter((user) => user.username !== username);
        setSearchUsers(filtered);
      } catch (err) {
        console.error("Error fetching users:", err.message);
      }
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:3500/api/user/${username}/friend-request`,
        { method: "GET" },
        accessToken,
        setAccessToken
      );

      if (!res.ok) throw new Error("Failed to fetch friend requests");

      const data = await res.json();
      console.log("Friend Request API Data:", data);

      setSentRequests(data.sentRequests || []);
      setReceivedRequests(data.receivedRequests || []);
    } catch (err) {
      console.error("Error fetching friend requests:", err.message);
    }
  };
  useEffect(() => {
    if (username) {
      fetchFriendRequests();
    }
  }, [username]);

  const sendFriendRequest = async (toUsername) => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:3500/api/user/${username}/friend-request/${toUsername}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        accessToken,
        setAccessToken
      );

      if (!res.ok) {
        throw new Error("Failed to send friend request");
      }

      const data = await res.json();
      console.log("Friend request sent:", data);
      await fetchFriendRequests();
    } catch (err) {
      console.error("Error sending friend request:", err.message);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    const fetchUsers = async () => {
      try {
        const res = await fetchWithAuth(
          `http://localhost:3500/api/user/${username}/friends`,
          { method: "GET" },
          accessToken,
          setAccessToken
        );
        const data = await res.json();
        console.log(data);
        console.log(data.friends);
        setUsers(data.friends || []);
      } catch (err) {
        console.error("Error fetching users:", err.message);
      }
    };

    fetchUsers();
  }, [accessToken, setAccessToken]);

  console.log(username);

  return (
    <div className="">
      <h1 className="">Welcome, {username}</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={SearchQuery}
        placeholder="Search..."
        className=""
      />
      {searchUsers.length > 0 && (
        <div className="absolute z-10 w-full bg-white shadow-md rounded mt-1 max-h-60 overflow-y-auto">
          {searchUsers.map((user, index) => {
            const status = getRequestStatus(user.username);
            return (
              <div
                key={index}
                className="px-4 py-2 flex justify-between items-center hover:bg-blue-100"
              >
                <span>{user.username}</span>

                {status ? (
                  <button
                    disabled
                    className={`px-3 py-1 rounded text-sm ${
                      status === "pending"
                        ? "bg-yellow-400 text-white"
                        : status === "accepted"
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ) : (
                  <button
                    onClick={() => sendFriendRequest(user.username)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Send-Request
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button onClick={getRequests} className="">
        <MessageCircle />
      </button>

      {showRequests && (
        <div className="absolute mt-2 w-full bg-white shadow-md rounded z-20 p-4 max-h-60 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Friend Requests</h3>
          {receivedRequests.length > 0 ? (
            receivedRequests.map((req, index) => (
              <div
                key={req._id}
                className="flex justify-between items-center border-b py-2"
              >
                <span className="font-medium">{req.from}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleRequestStatus(req._id, "accept")}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequestStatus(req._id, "reject")}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No new requests</p>
          )}
        </div>
      )}

      <button onClick={goToProfile} className="">
        <User className="" />
      </button>

      <div className="">
        {users.map((user, index) => (
          <button key={index} className="">
            {user}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
