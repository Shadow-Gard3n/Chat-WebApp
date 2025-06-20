import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
