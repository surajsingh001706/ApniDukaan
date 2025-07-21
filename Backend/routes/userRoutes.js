const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/users/register
// @desc    Register new user
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // ✅ Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
      if (err) throw err;

      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // ✅ Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err;

      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
