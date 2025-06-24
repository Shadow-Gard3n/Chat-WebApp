import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../utils/endpoint";

export const useSocket = (accessToken) => {
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!accessToken) return;

    socketRef.current = io(`${BASE_URL}`, {
      withCredentials: true,
      auth: { token: accessToken },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket:", socketRef.current.id);
    });

    socketRef.current.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [accessToken]);

  return { socket: socketRef.current, onlineUsers };
};
