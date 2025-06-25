// Import required modules
const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const { getTasks, createTask, updateTask, deleteTask, getTaskStats } = require("../controllers/taskController")

// Create router instance
const router = express.Router()

// Apply authentication middleware to all routes
router.use(authMiddleware)

// GET /api/tasks - Get all tasks for authenticated user
router.get("/", getTasks)

// POST /api/tasks - Create new task
router.post("/", createTask)

// PUT /api/tasks/:id - Update existing task
router.put("/:id", updateTask)

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", deleteTask)

// GET /api/tasks/stats - Get task statistics
router.get("/stats", getTaskStats)

// Export router
module.exports = router

/*
IMPORTANT VARIABLES:
- router: Express router instance for handling task routes
- authMiddleware: Middleware function to verify JWT tokens
- getTasks, createTask, updateTask, deleteTask, getTaskStats: Controller functions

MAJOR FUNCTIONS:
- router.use(): Applies middleware to all routes in this router
- router.get(), router.post(), router.put(), router.delete(): Define HTTP method handlers
- express.Router(): Creates modular route handlers
*/
