// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
const http = require("http").createServer(app); // HTTP server create for socket.io
const { Server } = require("socket.io");
const userRoutes = require("./routes/user"); // Add this

// CORS + JSON middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/chatapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // Add this

// Root route
app.get("/", (req, res) => {
  res.send("Chat App Backend Running...");
});

// Socket.io Setup
const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000", // React frontend origin
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("📡 New user connected:", socket.id);

  // Receive message from frontend
  socket.on("send-message", (data) => {
    console.log("📨 Message from:", data.sender, "->", data.text);

    // Broadcast to all other connected users
    socket.broadcast.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start Server
const PORT = 5000;
http.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
