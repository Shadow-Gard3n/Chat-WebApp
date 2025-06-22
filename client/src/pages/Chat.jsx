import { useEffect, useState, useRef, useMemo } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchWithAuth } from "../utils/Api";
import { jwtDecode } from "jwt-decode";

function Chat() {
  const { friendUsername } = useParams();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { accessToken, setAccessToken } = useAuth();
  const socketRef = useRef(null);

  const username = useMemo(() => {
    return accessToken ? jwtDecode(accessToken)?.username : "";
  }, [accessToken]);

  const getChatHistory = async () => {
    try {
      const res = await fetchWithAuth(
        `http://localhost:3500/api/user/chatsFrom/${username}/to/${friendUsername}`,
        { method: "GET" },
        accessToken,
        setAccessToken
      );

      const data = await res.json();
      console.log("Chat history:", data);
      setMessages(data);
    } catch (err) {
      console.error("Error fetching chat:", err.message);
    }
  };

  useEffect(() => {
    if (username && friendUsername && accessToken) {
      getChatHistory();
    }
  }, [username, friendUsername, accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    socketRef.current = io("http://localhost:3500", {
      withCredentials: true,
      auth: { token: accessToken },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket:", socketRef.current.id);
    });

    socketRef.current.on("chat message", (msg) => {
      console.log("Message received:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [accessToken]);

  const sendMessage = () => {
    if (messageInput.trim() === "") return;

    const msg = {
      receiver: friendUsername,
      content: messageInput,
    };

    // Emit using socketRef
    socketRef.current.emit("chat message", msg);

    setMessageInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-xl font-bold mb-4">
        Chatting with: {friendUsername}
      </h2>

      <div className="h-96 overflow-y-auto bg-white p-4 mb-4 rounded shadow flex flex-col space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-xs ${
              msg.sender === username
                ? "bg-blue-200 self-end"
                : "bg-gray-300 self-start"
            }`}
          >
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
          className="border rounded p-2 w-full"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
