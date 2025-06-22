import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!accessToken) return;

    const username = accessToken ? jwtDecode(accessToken).username : "";

    const newSocket = io("http://localhost:3500", {
      withCredentials: true,
      auth: {
        token: accessToken,
        username,
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    newSocket.on("online-users", (users) => {
      console.log("🌐 Online users:", users);
      setOnlineUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
