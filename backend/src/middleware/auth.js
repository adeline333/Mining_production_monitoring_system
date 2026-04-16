const User = require("../models/User");

// Simple authentication check (since we're not using JWT)
// In production, you would use sessions or JWT
const authenticate = async (req, res, next) => {
  try {
    const userId = req.headers["user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid user",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

// Check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

// Prevent data modification for demo accounts
const preventDemoModification = async (req, res, next) => {
  // Allow GET requests
  if (req.method === 'GET') {
    return next();
  }

  // Exempt auth routes that don't represent a logged-in user's modifications
  // Also login does not require user-id header, but this ensures safety
  if (req.originalUrl.includes('/api/auth/login') || req.originalUrl.includes('/api/auth/register')) {
    return next();
  }

  try {
    const userId = req.headers["user-id"];
    
    // If no user context, pass through (other middlewares handle authentication)
    if (!userId) {
      return next();
    }

    const user = await User.findById(userId);
    if (!user) {
      return next();
    }

    const demoEmails = [
      'admin@mining.com', 
      'supervisor@mining.com', 
      'operator@mining.com'
    ];

    if (demoEmails.includes(user.email)) {
      return res.status(403).json({
        success: false,
        message: "Action not permitted for demo accounts. Read-only access."
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate, authorize, preventDemoModification };
