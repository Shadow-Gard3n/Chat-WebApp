// src/pages/Signup.js
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", formData);

    fetch("http://localhost:3500/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Login failed");
        }
        return res.json(); // from backend
      })
      .then((data) => {
        console.log("Login success:", data);
        // move to login after success signup
        navigate("/home");
      })
      .catch((err) => {
        console.error("Error:", err.message);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Do not have an account? <Link to="/signup">Signup here</Link>
      </p>
    </div>
  );
}

export default Login;
