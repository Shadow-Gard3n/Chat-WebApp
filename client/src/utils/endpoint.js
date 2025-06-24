const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiFetch = (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  return fetch(url, options);
};
