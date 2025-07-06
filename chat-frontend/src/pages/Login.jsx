import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });



      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(res.data));
console.log("Login Success. Navigating to /chat");

setTimeout(() => {
  navigate("/chat");
}, 100);
      // ✅ Navigate to ChatPage
      navigate("/");
    } catch (error) {
      console.log(error);
      setErr("Login failed. Check credentials.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}
