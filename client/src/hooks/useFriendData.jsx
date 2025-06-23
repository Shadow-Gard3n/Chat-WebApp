// not in use yet
// import { useEffect, useState } from "react";
// import { fetchWithAuth } from "../utils/Api";

// export default function useFriendData(username, accessToken, setAccessToken) {
//   const [friends, setFriends] = useState([]);
//   const [sentRequests, setSentRequests] = useState([]);
//   const [receivedRequests, setReceivedRequests] = useState([]);

//   useEffect(() => {
//     if (!username) return;

//     const fetchFriendRequests = async () => {
//       const res = await fetchWithAuth(
//         `http://localhost:3500/api/user/${username}/friend-request`,
//         { method: "GET" },
//         accessToken,
//         setAccessToken
//       );
//       const data = await res.json();
//       setSentRequests(data.sentRequests || []);
//       setReceivedRequests(data.receivedRequests || []);
//     };

//     const fetchFriends = async () => {
//       const res = await fetchWithAuth(
//         `http://localhost:3500/api/user/${username}/friends`,
//         { method: "GET" },
//         accessToken,
//         setAccessToken
//       );
//       const data = await res.json();
//       setFriends(data.friends || []);
//     };

//     fetchFriendRequests();
//     fetchFriends();
//   }, [username, accessToken]);

//   return { friends, sentRequests, receivedRequests, setFriends };
// }
