// Import required modules
const express = require("express")
const { register, login } = require("../controllers/authController")

// Create router instance
const router = express.Router()

// POST /api/auth/register - Register new user
router.post("/register", register)

// POST /api/auth/login - Login existing user
router.post("/login", login)

// Export router
module.exports = router

/*
IMPORTANT VARIABLES:
- router: Express router instance for handling auth routes
- register: Controller function for user registration
- login: Controller function for user authentication

MAJOR FUNCTIONS:
- router.post(): Defines POST route handlers
- express.Router(): Creates modular route handlers
*/
