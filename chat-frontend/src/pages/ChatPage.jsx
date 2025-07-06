import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function ChatPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Check login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUsers(parsedUser._id);
    }
  }, [navigate]);

  // Fetch all users except current user
useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    navigate("/login");
  } else {
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchUsers(parsedUser._id); // <-- make sure _id exists here
  }
}, [navigate]);

const fetchUsers = async (id) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/users/all/${id}`);
    console.log("Fetched users:", res.data); // ✅ ADD THIS
    setUsers(res.data);
  } catch (err) {
    console.error("Failed to fetch users", err);
  }
};

  // Receive messages
  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  // Send message
  const sendMessage = () => {
    if (!selectedUser) {
      alert("Please select a user to chat with");
      return;
    }

    const msgData = {
      sender: user.username,
      receiver: selectedUser.username,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, msgData]);
    socket.emit("send-message", msgData);
    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome to Chat Page</h2>
      {user && <p>👤 Logged in as: <strong>{user.username}</strong></p>}
      <button onClick={handleLogout}>Logout</button>

<div>
  <h3>Select a user to chat with:</h3>
  <ul>
    {users.length === 0 ? (
      <p>⚠️ No users found.</p>
    ) : (
      users.map((u) => (
        <li
          key={u._id}
          style={{
            cursor: "pointer",
            color: selectedUser?._id === u._id ? "blue" : "black",
          }}
          onClick={() => setSelectedUser(u)}
        >
          {u.username}
        </li>
      ))
    )}
  </ul>
</div>


      {selectedUser && (
        <div style={{ marginTop: "20px" }}>
          <h3>Chatting with: {selectedUser.username}</h3>
          <input
            type="text"
            value={message}
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "70%", padding: "8px" }}
          />
          <button onClick={sendMessage} style={{ padding: "8px 16px", marginLeft: "10px" }}>
            Send
          </button>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <h3>💬 Messages</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.sender}</strong>: {msg.text}{" "}
              <span style={{ fontSize: "0.8em", color: "gray" }}>{msg.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
