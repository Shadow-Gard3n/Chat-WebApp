import { fetchWithAuth } from "./Api";


// home page routes 
export const fetchFriendRequests = async (username, token, setToken, setSent, setReceived) => {
  try {
    const res = await fetchWithAuth(
      `http://localhost:3500/api/user/${username}/friend-request`,
      { method: "GET" },
      token,
      setToken
    );
    if (!res.ok) throw new Error("Failed to fetch friend requests");
    const data = await res.json();
    setSent(data.sentRequests || []);
    setReceived(data.receivedRequests || []);
  } catch (err) {
    console.error("Error fetching friend requests:", err.message);
  }
};

export const fetchFriends = async (username, token, setToken, setUsers) => {
  try {
    const res = await fetchWithAuth(
      `http://localhost:3500/api/user/${username}/friends`,
      { method: "GET" },
      token,
      setToken
    );
    const data = await res.json();
    setUsers(data.friends || []);
  } catch (err) {
    console.error("Error fetching users:", err.message);
  }
};

export const sendFriendRequest = async (username, toUsername, token, setToken) => {
  try {
    const res = await fetchWithAuth(
      `http://localhost:3500/api/user/${username}/friend-request/${toUsername}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      token,
      setToken
    );
    if (!res.ok) throw new Error("Failed to send friend request");
    const data = await res.json();
    console.log("Friend request sent:", data);
  } catch (err) {
    console.error("Error sending friend request:", err.message);
  }
};

export const updateFriendRequestStatus = async (
  requestId,
  status,
  accessToken,
  setAccessToken,
  setReceivedRequests,
  username,
  setSentRequests,
  setUsers
) => {
  const res = await fetchWithAuth(
    `http://localhost:3500/api/user/friend-request/${requestId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
    accessToken,
    setAccessToken
  );

  if (!res.ok) throw new Error("Failed to accept request");

  const data = await res.json();

  setReceivedRequests((prev) =>
    prev.map((req) =>
      req._id === requestId ? { ...req, status: data.request.status } : req
    )
  );

  // refresh sent and received requests
  await fetchFriendRequests(
    username,
    accessToken,
    setAccessToken,
    setSentRequests,
    setReceivedRequests
  );
  await fetchFriends(username, accessToken, setAccessToken, setUsers);
};

export const searchUsers = async (
  query,
  currentUsername,
  accessToken,
  setAccessToken,
  setSearchResults
) => {
  const res = await fetchWithAuth(
    `http://localhost:3500/api/user/search?username=${query}`,
    { method: "GET" },
    accessToken,
    setAccessToken
  );

  if (res.status === 404) {
    setSearchResults([" "]);
    return;
  }

  if (!res.ok) {
    throw new Error("Search request failed");
  }

  const data = await res.json();
  const filtered = data.filter((user) => user.username !== currentUsername);
  setSearchResults(filtered);
};


