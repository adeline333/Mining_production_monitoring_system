const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/auth");

// @route   GET /api/users
// @desc    Get all users
// @access  Admin
router.get("/", getAllUsers);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Admin
router.get("/:id", getUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Admin
router.put("/:id", updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Admin
router.delete("/:id", deleteUser);

// @route   PUT /api/users/:id/toggle-status
// @desc    Toggle user active status
// @access  Admin
router.put("/:id/toggle-status", toggleUserStatus);

module.exports = router;
