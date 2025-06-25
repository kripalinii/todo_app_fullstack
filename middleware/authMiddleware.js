// Import JWT library
const jwt = require("jsonwebtoken")

// Middleware function to verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header("Authorization")

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      })
    }

    // Extract token from "Bearer TOKEN" format
    const token = authHeader.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token format.",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    // Add user info to request object
    req.user = decoded

    // Continue to next middleware/route handler
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
      })
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      })
    }

    // Generic error response
    res.status(401).json({
      success: false,
      message: "Token verification failed.",
    })
  }
}

// Export middleware function
module.exports = authMiddleware

/*
IMPORTANT VARIABLES:
- authHeader: Authorization header from HTTP request
- token: JWT token extracted from header
- decoded: Decoded JWT payload containing user information
- JWT_SECRET: Secret key used to verify token signature

MAJOR FUNCTIONS:
- authMiddleware(): Main middleware function for token verification
- jwt.verify(): Verifies and decodes JWT token
- req.header(): Extracts specific header from HTTP request
- next(): Passes control to next middleware or route handler
*/
