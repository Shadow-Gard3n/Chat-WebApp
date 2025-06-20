import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchWithAuth } from "../utils/Api";
import { jwtDecode } from "jwt-decode";

function Home() {
  const { accessToken, setAccessToken } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!accessToken) return;

    const decoded = jwtDecode(accessToken);
    const username = decoded?.username;

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

  const username = accessToken ? jwtDecode(accessToken)?.username : "";
  console.log(username);
  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Welcome, {username}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <button
            key={index}
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            {user}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
