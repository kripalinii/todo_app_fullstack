// Import required modules
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

// Import routes
const authRoutes = require("./routes/auth")
const taskRoutes = require("./routes/tasks")

// Create Express application
const app = express()
const PORT = process.env.PORT || 3000

// Middleware setup
app.use(cors()) // Enable Cross-Origin Resource Sharing
app.use(express.json()) // Parse JSON request bodies
app.use(express.static("public")) // Serve static files from public directory

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/todoapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Route handlers
app.use("/api/auth", authRoutes) // Authentication routes
app.use("/api/tasks", taskRoutes) // Task management routes

// Serve HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"))
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

/*
IMPORTANT VARIABLES:
- app: Express application instance
- PORT: Server port number (default 3000)
- authRoutes: Authentication route handlers
- taskRoutes: Task management route handlers

MAJOR FUNCTIONS:
- mongoose.connect(): Establishes database connection
- app.use(): Registers middleware and routes
- app.listen(): Starts the server on specified port
*/
