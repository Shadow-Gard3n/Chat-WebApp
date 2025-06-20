
export const fetchWithAuth = async (url, options = {}, accessToken, setAccessToken) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 403 || res.status === 401) {
    const refreshRes = await fetch("http://localhost:3500/api/refresh", {
      method: "GET",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      setAccessToken(data.accessToken);

      // retry request with new access token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${data.accessToken}`,
        },
      });
    } else {
      throw new Error("Session expired. Please log in again.");
    }
  }

  return res;
};
