import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Chat() {
  const { friendUsername } = useParams();
  const { accessToken } = useAuth();

  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const socketRef = useRef(null);

  // Extract username from JWT
  useEffect(() => {
    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      setUsername(payload.username);
    }
  }, [accessToken]);

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
