const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public (Admin only in production)
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", login);

// @route   GET /api/auth/profile/:id
// @desc    Get user profile
// @access  Private
router.get("/profile/:id", getProfile);

// @route   PUT /api/auth/profile/:id
// @desc    Update user profile
// @access  Private
router.put("/profile/:id", updateProfile);

// @route   PUT /api/auth/change-password/:id
// @desc    Change user password
// @access  Private
router.put("/change-password/:id", changePassword);

module.exports = router;
