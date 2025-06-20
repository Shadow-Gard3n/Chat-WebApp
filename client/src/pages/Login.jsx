import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, MessageCircle, User, Lock } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", formData);

    fetch("http://localhost:3500/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include", //for refresh token
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Login failed");
        }
        return res.json(); // from backend
      })
      .then((data) => {
        console.log("Login success:", data);
        setAccessToken(data.accessToken);
        // move to login after success signup
        navigate("/home");
      })
      .catch((err) => {
        console.error("Error:", err.message);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join ChatApp</h1>
          <p className="text-slate-300 text-lg">
            Connect with friends and start conversations
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-center">
              Please log in to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-300"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 border-slate-600 focus:border-blue-500 focus:ring-blue-500/50`}
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`w-full pl-10 pr-12 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 border-slate-600 focus:border-blue-500 focus:ring-blue-500/50
                    }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Do not have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium underline"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            By logging in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div>
  //     <h2>Login</h2>
  //     <form onSubmit={handleSubmit}>
  //       <div>
  //         <label>Username: </label>
  //         <input
  //           type="text"
  //           required
  //           value={formData.username}
  //           onChange={(e) =>
  //             setFormData({ ...formData, username: e.target.value })
  //           }
  //         />
  //       </div>

  //       <div>
  //         <label>Password: </label>
  //         <input
  //           type="password"
  //           required
  //           value={formData.password}
  //           onChange={(e) =>
  //             setFormData({ ...formData, password: e.target.value })
  //           }
  //         />
  //       </div>

  //       <button type="submit">Login</button>
  //     </form>

  //     <p style={{ marginTop: "10px" }}>
  //       Do not have an account? <Link to="/signup">Signup here</Link>
  //     </p>
  //   </div>
  // );
}

export default Login;
