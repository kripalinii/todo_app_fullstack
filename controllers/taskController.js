// Import Task model
const Task = require("../models/Task")

// Get all tasks for authenticated user
const getTasks = async (req, res) => {
  try {
    const { category, completed, sortBy } = req.query
    const userId = req.user.userId

    // Build filter object
    const filter = { userId }

    // Add category filter if specified
    if (category && category !== "all") {
      filter.category = category
    }

    // Add completion status filter if specified
    if (completed !== undefined) {
      filter.completed = completed === "true"
    }

    // Build sort object
    const sort = {}
    switch (sortBy) {
      case "dueDate":
        sort.dueDate = 1 // Ascending order
        break
      case "category":
        sort.category = 1
        break
      case "created":
        sort.createdAt = -1 // Newest first
        break
      default:
        sort.dueDate = 1 // Default sort by due date
    }

    // Fetch tasks from database
    const tasks = await Task.find(filter).sort(sort)

    res.json({
      success: true,
      tasks,
    })
  } catch (error) {
    console.error("Get tasks error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
    })
  }
}

// Create new task
const createTask = async (req, res) => {
  try {
    const { title, description, category, dueDate } = req.body
    const userId = req.user.userId

    // Validate required fields
    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Title and due date are required",
      })
    }

    // Create new task
    const task = new Task({
      title,
      description: description || "",
      category: category || "Personal",
      dueDate: new Date(dueDate),
      userId,
    })

    await task.save()

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    })
  } catch (error) {
    console.error("Create task error:", error)
    res.status(500).json({
      success: false,
      message: "Error creating task",
    })
  }
}

// Update existing task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId
    const updates = req.body

    // Find and update task
    const task = await Task.findOneAndUpdate(
      { _id: id, userId }, // Ensure user owns the task
      updates,
      { new: true, runValidators: true },
    )

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      })
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      task,
    })
  } catch (error) {
    console.error("Update task error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating task",
    })
  }
}

// Delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    // Find and delete task
    const task = await Task.findOneAndDelete({ _id: id, userId })

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      })
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
    })
  } catch (error) {
    console.error("Delete task error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting task",
    })
  }
}

// Get today's task statistics
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.userId
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get today's tasks
    const todaysTasks = await Task.find({
      userId,
      dueDate: { $gte: today, $lt: tomorrow },
    })

    // Calculate statistics
    const totalTasks = todaysTasks.length
    const completedTasks = todaysTasks.filter((task) => task.completed).length
    const pendingTasks = totalTasks - completedTasks

    res.json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
    })
  } catch (error) {
    console.error("Get stats error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching task statistics",
    })
  }
}

// Export controller functions
module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
}

/*
IMPORTANT VARIABLES:
- filter: Object used to filter tasks by category, completion status, etc.
- sort: Object defining how to sort the returned tasks
- userId: ID of the authenticated user from JWT token
- today: Date object representing start of current day
- tomorrow: Date object representing start of next day

MAJOR FUNCTIONS:
- getTasks(): Retrieves filtered and sorted tasks for user
- createTask(): Creates new task with validation
- updateTask(): Updates existing task with ownership check
- deleteTask(): Removes task with ownership verification
- getTaskStats(): Calculates daily task completion statistics
- Task.find(): Queries database for tasks matching criteria
- Task.findOneAndUpdate(): Updates single task and returns updated version
- Task.findOneAndDelete(): Removes single task from database
*/
