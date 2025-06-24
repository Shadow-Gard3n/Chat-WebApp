import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();
import { BASE_URL } from "../utils/endpoint";

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/refresh`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);
        }
      } catch (err) {
        console.error("Auto-refresh failed:", err.message);
      } finally {
        setLoading(false);
      }
    };

    refreshToken();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
