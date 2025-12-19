require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Basic route to test server
app.get("/", (req, res) => {
  res.json({
    message: "Mining Production System API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      production: "/api/production",
      equipment: "/api/equipment",
      reports: "/api/reports",
      minerals: "/api/minerals",
      shifts: "/api/shifts",
      users: "/api/users",
      incidents: "/api/incidents",
    },
  });
});

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/production", require("./src/routes/production"));
app.use("/api/equipment", require("./src/routes/equipment"));
app.use("/api/reports", require("./src/routes/reports"));
app.use("/api/minerals", require("./src/routes/minerals"));
app.use("/api/shifts", require("./src/routes/shifts"));
app.use("/api/users", require("./src/routes/users"));
// Add this line with other route imports
app.use("/api/incidents", require("./src/routes/incidents"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
