// Global variables for application state
let currentUser = null
let allTasks = []
let currentEditingTask = null

// DOM elements
const userWelcome = document.getElementById("userWelcome")
const darkModeToggle = document.getElementById("darkModeToggle")
const logoutBtn = document.getElementById("logoutBtn")
const taskForm = document.getElementById("taskForm")
const tasksContainer = document.getElementById("tasksContainer")
const noTasks = document.getElementById("noTasks")
const dashboardMessage = document.getElementById("dashboardMessage")
const taskCount = document.getElementById("taskCount")
const progressFill = document.getElementById("progressFill")
const progressText = document.getElementById("progressText")

// Filter elements
const filterCategory = document.getElementById("filterCategory")
const filterStatus = document.getElementById("filterStatus")
const sortBy = document.getElementById("sortBy")

// Modal elements
const editModal = document.getElementById("editModal")
const editTaskForm = document.getElementById("editTaskForm")
const closeModal = document.querySelector(".close")
const cancelEdit = document.getElementById("cancelEdit")

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication()
  initializeEventListeners()
  loadDarkModePreference()
  setDefaultDueDate()
})

// Check if user is authenticated
function checkAuthentication() {
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user")

  if (!token || !user) {
    // Redirect to login if not authenticated
    window.location.href = "/"
    return
  }

  try {
    currentUser = JSON.parse(user)
    userWelcome.textContent = `Welcome back, ${currentUser.username}!`
    loadTasks()
    loadTaskStats()
  } catch (error) {
    console.error("Error parsing user data:", error)
    logout()
  }
}

// Set up all event listeners
function initializeEventListeners() {
  // Dark mode toggle
  darkModeToggle.addEventListener("click", toggleDarkMode)

  // Logout functionality
  logoutBtn.addEventListener("click", logout)

  // Task form submission
  taskForm.addEventListener("submit", handleTaskSubmit)

  // Filter and sort changes
  filterCategory.addEventListener("change", applyFilters)
  filterStatus.addEventListener("change", applyFilters)
  sortBy.addEventListener("change", applyFilters)

  // Modal event listeners
  closeModal.addEventListener("click", closeEditModal)
  cancelEdit.addEventListener("click", closeEditModal)
  editTaskForm.addEventListener("submit", handleEditSubmit)

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === editModal) {
      closeEditModal()
    }
  })
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode")
  const isDarkMode = document.body.classList.contains("dark-mode")

  // Update button text
  darkModeToggle.textContent = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"

  // Save preference to localStorage
  localStorage.setItem("darkMode", isDarkMode)
}

// Load dark mode preference
function loadDarkModePreference() {
  const isDarkMode = localStorage.getItem("darkMode") === "true"
  if (isDarkMode) {
    document.body.classList.add("dark-mode")
    darkModeToggle.textContent = "☀️ Light Mode"
  }
}

// Set default due date to today
function setDefaultDueDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")

  const defaultDateTime = `${year}-${month}-${day}T${hours}:${minutes}`
  document.getElementById("taskDueDate").value = defaultDateTime
}

// Handle task form submission
async function handleTaskSubmit(e) {
  e.preventDefault()

  const title = document.getElementById("taskTitle").value.trim()
  const description = document.getElementById("taskDescription").value.trim()
  const category = document.getElementById("taskCategory").value
  const dueDate = document.getElementById("taskDueDate").value

  if (!title || !dueDate) {
    showMessage("Please fill in all required fields", "error")
    return
  }

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title,
        description,
        category,
        dueDate,
      }),
    })

    const data = await response.json()

    if (data.success) {
      showMessage("Task created successfully!", "success")
      taskForm.reset()
      setDefaultDueDate()
      loadTasks()
      loadTaskStats()
    } else {
      showMessage(data.message, "error")
    }
  } catch (error) {
    console.error("Create task error:", error)
    showMessage("Error creating task. Please try again.", "error")
  }
}

// Load all tasks from server
async function loadTasks() {
  try {
    const response = await fetch("/api/tasks", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    const data = await response.json()

    if (data.success) {
      allTasks = data.tasks
      applyFilters()
    } else {
      showMessage("Error loading tasks", "error")
    }
  } catch (error) {
    console.error("Load tasks error:", error)
    showMessage("Error loading tasks. Please refresh the page.", "error")
  }
}

// Apply filters and sorting to tasks
function applyFilters() {
  const categoryFilter = filterCategory.value
  const statusFilter = filterStatus.value
  const sortOption = sortBy.value

  let filteredTasks = [...allTasks]

  // Apply category filter
  if (categoryFilter !== "all") {
    filteredTasks = filteredTasks.filter((task) => task.category === categoryFilter)
  }

  // Apply status filter
  if (statusFilter !== "all") {
    const isCompleted = statusFilter === "true"
    filteredTasks = filteredTasks.filter((task) => task.completed === isCompleted)
  }

  // Apply sorting
  filteredTasks.sort((a, b) => {
    switch (sortOption) {
      case "dueDate":
        return new Date(a.dueDate) - new Date(b.dueDate)
      case "category":
        return a.category.localeCompare(b.category)
      case "created":
        return new Date(b.createdAt) - new Date(a.createdAt)
      default:
        return new Date(a.dueDate) - new Date(b.dueDate)
    }
  })

  displayTasks(filteredTasks)
}

// Display tasks in the UI
function displayTasks(tasks) {
  taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`

  if (tasks.length === 0) {
    tasksContainer.style.display = "none"
    noTasks.style.display = "block"
    return
  }

  tasksContainer.style.display = "block"
  noTasks.style.display = "none"

  tasksContainer.innerHTML = tasks.map((task) => createTaskHTML(task)).join("")
}

// Create HTML for a single task
function createTaskHTML(task) {
  const dueDate = new Date(task.dueDate)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())

  // Determine task status class
  let statusClass = ""
  if (task.completed) {
    statusClass = "completed"
  } else if (taskDate < today) {
    statusClass = "overdue"
  } else if (taskDate.getTime() === today.getTime()) {
    statusClass = "due-today"
  }

  // Format due date
  const formattedDate = dueDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return `
        <div class="task-item ${statusClass}">
            <div class="task-header">
                <h4 class="task-title ${task.completed ? "completed" : ""}">${escapeHtml(task.title)}</h4>
                <span class="task-category">${task.category}</span>
            </div>
            ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ""}
            <div class="task-meta">
                <span class="task-due-date ${statusClass}">Due: ${formattedDate}</span>
            </div>
            <div class="task-actions">
                <button class="btn ${task.completed ? "btn-warning" : "btn-success"}" onclick="toggleTaskComplete('${task._id}', ${!task.completed})">
                    ${task.completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <button class="btn btn-secondary" onclick="editTask('${task._id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        </div>
    `
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Toggle task completion status
async function toggleTaskComplete(taskId, completed) {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ completed }),
    })

    const data = await response.json()

    if (data.success) {
      showMessage(`Task ${completed ? "completed" : "marked as incomplete"}!`, "success")
      loadTasks()
      loadTaskStats()
    } else {
      showMessage(data.message, "error")
    }
  } catch (error) {
    console.error("Toggle task error:", error)
    showMessage("Error updating task. Please try again.", "error")
  }
}

// Open edit modal for task
function editTask(taskId) {
  const task = allTasks.find((t) => t._id === taskId)
  if (!task) {
    showMessage("Task not found", "error")
    return
  }

  currentEditingTask = task

  // Populate form fields
  document.getElementById("editTaskTitle").value = task.title
  document.getElementById("editTaskDescription").value = task.description || ""
  document.getElementById("editTaskCategory").value = task.category

  // Format date for datetime-local input
  const dueDate = new Date(task.dueDate)
  const year = dueDate.getFullYear()
  const month = String(dueDate.getMonth() + 1).padStart(2, "0")
  const day = String(dueDate.getDate()).padStart(2, "0")
  const hours = String(dueDate.getHours()).padStart(2, "0")
  const minutes = String(dueDate.getMinutes()).padStart(2, "0")

  document.getElementById("editTaskDueDate").value = `${year}-${month}-${day}T${hours}:${minutes}`

  // Show modal
  editModal.style.display = "block"
}

// Handle edit form submission
async function handleEditSubmit(e) {
  e.preventDefault()

  if (!currentEditingTask) {
    showMessage("No task selected for editing", "error")
    return
  }

  const title = document.getElementById("editTaskTitle").value.trim()
  const description = document.getElementById("editTaskDescription").value.trim()
  const category = document.getElementById("editTaskCategory").value
  const dueDate = document.getElementById("editTaskDueDate").value

  if (!title || !dueDate) {
    showMessage("Please fill in all required fields", "error")
    return
  }

  try {
    const response = await fetch(`/api/tasks/${currentEditingTask._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title,
        description,
        category,
        dueDate,
      }),
    })

    const data = await response.json()

    if (data.success) {
      showMessage("Task updated successfully!", "success")
      closeEditModal()
      loadTasks()
      loadTaskStats()
    } else {
      showMessage(data.message, "error")
    }
  } catch (error) {
    console.error("Edit task error:", error)
    showMessage("Error updating task. Please try again.", "error")
  }
}

// Close edit modal
function closeEditModal() {
  editModal.style.display = "none"
  currentEditingTask = null
  editTaskForm.reset()
}

// Delete task
async function deleteTask(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) {
    return
  }

  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    const data = await response.json()

    if (data.success) {
      showMessage("Task deleted successfully!", "success")
      loadTasks()
      loadTaskStats()
    } else {
      showMessage(data.message, "error")
    }
  } catch (error) {
    console.error("Delete task error:", error)
    showMessage("Error deleting task. Please try again.", "error")
  }
}

// Load task statistics for progress bar
async function loadTaskStats() {
  try {
    const response = await fetch("/api/tasks/stats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    const data = await response.json()

    if (data.success) {
      const { totalTasks, completedTasks, completionRate } = data.stats

      // Update progress bar
      progressFill.style.width = `${completionRate}%`
      progressText.textContent = `${completedTasks} out of ${totalTasks} tasks completed today`
    }
  } catch (error) {
    console.error("Load stats error:", error)
  }
}

// Show message to user
function showMessage(message, type) {
  dashboardMessage.textContent = message
  dashboardMessage.className = `message ${type}`
  dashboardMessage.style.display = "block"

  // Auto-hide message after 5 seconds
  setTimeout(() => {
    dashboardMessage.style.display = "none"
  }, 5000)
}

// Logout user
function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  window.location.href = "/"
}

// Handle authentication errors
function handleAuthError() {
  showMessage("Session expired. Please login again.", "error")
  setTimeout(() => {
    logout()
  }, 2000)
}

/*
IMPORTANT VARIABLES:
- currentUser: Stores authenticated user information
- allTasks: Array containing all user tasks
- currentEditingTask: Task currently being edited in modal
- tasksContainer: DOM element where tasks are displayed
- editModal: Modal dialog for editing tasks
- progressFill: Progress bar fill element
- filterCategory, filterStatus, sortBy: Filter and sort controls

MAJOR FUNCTIONS:
- checkAuthentication(): Verifies user login status and redirects if needed
- initializeEventListeners(): Sets up all DOM event handlers
- toggleDarkMode(): Switches between light and dark themes
- handleTaskSubmit(): Processes new task creation form
- loadTasks(): Fetches all tasks from server API
- applyFilters(): Filters and sorts tasks based on user selection
- displayTasks(): Renders filtered tasks in the UI
- createTaskHTML(): Generates HTML markup for individual task items
- toggleTaskComplete(): Updates task completion status
- editTask(): Opens modal with task data for editing
- deleteTask(): Removes task after user confirmation
- loadTaskStats(): Fetches and displays daily progress statistics
- showMessage(): Displays success/error messages to user
- logout(): Clears authentication data and redirects to login
- escapeHtml(): Prevents XSS attacks by escaping HTML characters
*/
