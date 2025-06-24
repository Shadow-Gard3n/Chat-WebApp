import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { accessToken, setAccessToken } = useAuth();
  const navigate = useNavigate();

  const username = useMemo(() => {
    return accessToken ? jwtDecode(accessToken)?.username : "";
  }, [accessToken]);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3500/api/logout", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 204) {
        setAccessToken(null);
        navigate("/login");
      } else {
        console.error("Failed to logout:", res.status);
      }
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white flex items-center justify-center">
      <button
        onClick={() => navigate("/home")}
        className="absolute top-6 left-6 text-white text-4xl font-light hover:text-blue-400 transition-transform hover:scale-110"
        aria-label="Go back"
      >
        ←
      </button>

      <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md space-y-6 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Your Profile
        </h2>

        <div className="text-lg">
          <span className="text-gray-400">Username:</span>{" "}
          <span className="font-semibold text-white">{username}</span>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
