import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Search, User, MessageCircle, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useRef } from "react";
import FriendRequestList from "../components/FriendRequestList";
import UserSearchResults from "../components/UserSearchResults";
import { useSocket } from "../hooks/useSocket";
import FriendList from "../components/FriendList";
import {
  fetchFriends,
  fetchFriendRequests,
  sendFriendRequest,
  updateFriendRequestStatus,
  searchUsers,
} from "../utils/userApi";

function Home() {
  const { accessToken, setAccessToken } = useAuth();

  const username = useMemo(() => {
    return accessToken ? jwtDecode(accessToken)?.username : "";
  }, [accessToken]);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const { socket, onlineUsers } = useSocket(accessToken);

  const getRequestStatus = (toUsername) => {
    const sent = sentRequests.find((req) => req.to === toUsername);
    if (sent) return sent.status;
    return null;
  };

  const getRequests = () => {
    setShowRequests((prev) => !prev);
  };

  const handleRequestStatus = async (id, status) => {
    try {
      await updateFriendRequestStatus(
        id,
        status,
        accessToken,
        setAccessToken,
        setReceivedRequests,
        username,
        setSentRequests,
        setUsers
      );
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
        await searchUsers(
          query,
          username,
          accessToken,
          setAccessToken,
          setSearchResults
        );
      } catch (err) {
        console.error("Error fetching users:", err.message);
      }
    }
  };

  // to remove the dropdown of search bar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchFriends(username, accessToken, setAccessToken, setUsers);
  }, [accessToken, setAccessToken]);

  useEffect(() => {
    if (username) {
      fetchFriendRequests(
        username,
        accessToken,
        setAccessToken,
        setSentRequests,
        setReceivedRequests
      );
    }
  }, [username]);

  const handleSendRequest = async (toUsername) => {
    await sendFriendRequest(username, toUsername, accessToken, setAccessToken);
    await fetchFriendRequests(
      username,
      accessToken,
      setAccessToken,
      setSentRequests,
      setReceivedRequests
    );
  };

  console.log(username);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Row */}
        <div className="flex justify-between items-center">
          {/* Welcome text */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent whitespace-nowrap">
            Welcome, {username}
          </h1>

          {/* profile and request button */}
          <div className="flex gap-4">
            <div className="relative">
              <button
                onClick={getRequests}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition"
              >
                <MessageCircle className="w-5 h-5" />
                Requests
              </button>

              {/* Friend Requests dropdown */}
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
          {searchResults.length > 0 &&
            (searchResults[0] === " " ? (
              <div className="text-red-400 px-4 py-2 italic flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>No users found</span>
              </div>
            ) : (
              <UserSearchResults
                results={searchResults}
                getRequestStatus={getRequestStatus}
                onSendRequest={handleSendRequest}
              />
            ))}
        </div>

        {/* Friend List */}
        <FriendList
          users={users}
          onlineUsers={onlineUsers}
          goToChat={goToChat}
        />
      </div>
    </div>
  );
}

export default Home;
