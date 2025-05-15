import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { AuthContext } from "../AuthContext";
import "../App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "SOL" && password === "IUSOL") {
      setError("");
      login(); // Set isLoggedIn = true và lưu vào localStorage
      console.log("Login successful");
      navigate("/home");
    } else {
      setError("Wrong username or password! Try again ♥");
    }
  };

  return (
    <div
      className="login-gradient-bg"
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <form className="login-box" onSubmit={handleLogin}>
      
        <div className="login-title">Login</div>
        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toUpperCase())}
          autoCapitalize="characters"
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value.toUpperCase())}
          autoCapitalize="characters"
        />
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="login-btn">Let me in</button>
      </form>
    </div>
  );
}

export default Login;
