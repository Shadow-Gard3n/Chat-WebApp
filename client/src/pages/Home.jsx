import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchWithAuth } from "../utils/Api";
import { jwtDecode } from "jwt-decode";
import { Search, User, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useRef } from "react";
import FriendRequestList from "../components/FriendRequestList";
import UserSearchResults from "../components/UserSearchResults";

function Home() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
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

      setReceivedRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: data.request.status } : req
        )
      );

      await fetchFriendRequests();
      await fetchFriends();
    } catch (err) {
      console.error("Error accepting request:", err.message);
    }
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const goToChat = (friendUsername) => {
    navigate(`/chat/${friendUsername}`);
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

        if (res.status === 404) {
          setSearchUsers([" "]);
          return;
        }

        const data = await res.json();
        console.log(data);
        const filtered = data.filter((user) => user.username !== username);
        setSearchUsers(filtered);
      } catch (err) {
        console.error("Error fetching users:", err.message);
      }
    }
  };

  // to remove the dropdown of search bar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchUsers([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const fetchFriends = () => {
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
  };

  useEffect(() => {
    fetchFriends();
  }, [accessToken, setAccessToken]);

  console.log(username);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Row */}
        <div className="flex justify-between items-center">
          {/* Welcome Text Left */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent whitespace-nowrap">
            Welcome, {username}
          </h1>

          {/* Buttons Right */}
          <div className="flex gap-4">
            <div className="relative">
              <button
                onClick={getRequests}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition"
              >
                <MessageCircle className="w-5 h-5" />
                Requests
              </button>

              {/* Friend Requests Dropdown */}
              {showRequests && (
                <div className="absolute top-full left-0 mt-2 w-80 z-50 bg-zinc-800 rounded-lg shadow-lg">
                  <FriendRequestList
                    requests={receivedRequests}
                    onAccept={(id) => handleRequestStatus(id, "accept")}
                    onReject={(id) => handleRequestStatus(id, "reject")}
                  />
                </div>
              )}
            </div>

            <button
              onClick={goToProfile}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition"
            >
              <User className="w-5 h-5" />
              Profile
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div ref={searchRef} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={SearchQuery}
            placeholder="Search..."
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          />
          {searchUsers.length > 0 &&
            (searchUsers[0] === " " ? (
              <div className="text-red-400 px-4 py-2 italic flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>No users found</span>
              </div>
            ) : (
              <UserSearchResults
                results={searchUsers}
                getRequestStatus={getRequestStatus}
                onSendRequest={sendFriendRequest}
              />
            ))}
        </div>

        {/* Friend List */}
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-100">
            Your Friends:
          </h2>
          {users.length > 0 ? (
            <div className="flex flex-col space-y-2">
              {users.map((user, index) => (
                <button
                  onClick={() => goToChat(user)}
                  key={index}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg text-left transition"
                >
                  {user}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex justify-center">
              <p className="text-sm text-gray-400 font-bold italic">
                No friends yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
