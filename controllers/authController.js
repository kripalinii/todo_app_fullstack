// Import required modules
const User = require("../models/User")
const jwt = require("jsonwebtoken")

// Generate JWT token for user authentication
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d", // Token expires in 7 days
  })
}

// Handle user registration
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, email, and password",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      })
    }

    // Create new user
    const user = new User({ username, email, password })
    await user.save()

    // Generate token and send response
    const token = generateToken(user._id)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    })
  }
}

// Handle user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Generate token and send response
    const token = generateToken(user._id)
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during login",
    })
  }
}

// Export controller functions
module.exports = {
  register,
  login,
}

/*
IMPORTANT VARIABLES:
- JWT_SECRET: Secret key for signing JWT tokens
- existingUser: User found in database during registration check
- token: Generated JWT token for authentication
- isPasswordValid: Boolean result of password comparison

MAJOR FUNCTIONS:
- generateToken(): Creates JWT token with user ID and expiration
- register(): Handles new user registration with validation
- login(): Authenticates user and returns token
- User.findOne(): Searches for user in database
- user.comparePassword(): Validates entered password against stored hash
*/
