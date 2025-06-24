import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Send, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchWithAuth } from "../utils/Api";
import { useSocket } from "../hooks/useSocket";
import { BASE_URL } from "../utils/endpoint";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();
  const { friendUsername } = useParams();
  const { accessToken, setAccessToken } = useAuth();
  const { socket, onlineUsers } = useSocket(accessToken);

  const username = useMemo(() => {
    return accessToken ? jwtDecode(accessToken)?.username : "";
  }, [accessToken]);

  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isFriendOnline = onlineUsers.includes(friendUsername);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getChatHistory = async () => {
    try {
      const res = await fetchWithAuth(
        `${BASE_URL}/api/user/chatsFrom/${username}/to/${friendUsername}`,
        { method: "GET" },
        accessToken,
        setAccessToken
      );
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching chat:", err.message);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() === "") return;

    const msg = {
      receiver: friendUsername,
      content: messageInput,
    };

    socket?.emit("chat message", msg);
    setMessageInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (username && friendUsername && accessToken) {
      getChatHistory();
    }
  }, [username, friendUsername, accessToken]);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat message", handleIncomingMessage);
    return () => {
      socket.off("chat message", handleIncomingMessage);
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 shadow-2xl">
        <div className="mx-auto flex items-center space-x-3">
          {/* Back Button */}
          <button
            onClick={() => navigate("/home")}
            className="mr-4 text-white hover:text-purple-400 text-xl md:text-2xl"
            aria-label="Go back"
          >
            ←
          </button>
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Chatting with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {friendUsername}
              </span>
            </h2>
            <p
              className={`text-sm ${
                onlineUsers.includes(friendUsername)
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {onlineUsers.includes(friendUsername) ? "Online now" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Box Area */}
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-none">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === username ? "justify-end" : "justify-start"
                } animate-fadeIn`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`flex flex-col max-w-sm lg:max-w-md`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm break-words shadow-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-105 ${
                      msg.sender === username
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-sm"
                        : "bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-tl-sm border border-white/10"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div
                    className={`text-xs text-gray-400 mt-1 px-1 ${
                      msg.sender === username ? "text-right" : "text-left"
                    }`}
                  >
                    {formatDateTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="bg-black/20 backdrop-blur-xl border-t border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={messageInput.trim() === ""}
              className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thumb-white\/20::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
      `}</style>
    </div>
  );
}

export default Chat;
