const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User'); // ✅ Correct path to your User model

// 🔥 GET all users except current logged-in user
router.get('/all/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID' });
    }

    // ✅ Find all users except the one whose id matches
    const users = await User.find({ _id: { $ne: userId } }).select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error while fetching users:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
