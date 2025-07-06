const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Save message
router.post("/", async (req, res) => {
  const { from, to, message } = req.body;
  const msg = new Message({ from, to, message });
  await msg.save();
  res.status(201).json({ message: "Message stored" });
});

// Get chat history
router.post("/get", async (req, res) => {
  const { from, to } = req.body;
  const msgs = await Message.find({
    $or: [ { from, to }, { from: to, to: from } ]
  }).sort({ createdAt: 1 });
  res.json(msgs);
});

module.exports = router;