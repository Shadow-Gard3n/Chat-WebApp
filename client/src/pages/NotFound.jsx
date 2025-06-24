import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
      <MessageCircle className="w-16 h-16 mb-4 text-purple-400" />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-slate-400 mb-6">Oops! Looks like you’re lost.</p>
      <Link
        to="/login"
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition"
      >
        Go to Login
      </Link>
    </div>
  );
}

export default NotFound;
