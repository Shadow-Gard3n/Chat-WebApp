// import { useState, useEffect } from "react";
// import { fetchWithAuth } from "../utils/Api";

// export const useFriends = (username, accessToken, setAccessToken) => {
//   const [friends, setFriends] = useState([]);

//   useEffect(() => {
//     if (!accessToken || !username) return;

//     const fetchFriends = async () => {
//       try {
//         const res = await fetchWithAuth(
//           `http://localhost:3500/api/user/${username}/friends`,
//           { method: "GET" },
//           accessToken,
//           setAccessToken
//         );
//         const data = await res.json();
//         setFriends(data.friends || []);
//       } catch (err) {
//         console.error("Error fetching friends:", err.message);
//       }
//     };

//     fetchFriends();
//   }, [accessToken, username]);

//   return { friends, setFriends };
// };
