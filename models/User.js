// Import mongoose for database modeling
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Define user schema structure
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
)

// Hash password before saving user to database
userSchema.pre("save", async function (next) {
  // Only hash password if it has been modified
  if (!this.isModified("password")) return next()

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Export User model
module.exports = mongoose.model("User", userSchema)

/*
IMPORTANT VARIABLES:
- userSchema: Mongoose schema defining user structure
- salt: Random data used for password hashing
- candidatePassword: Plain text password for comparison

MAJOR FUNCTIONS:
- userSchema.pre('save'): Middleware to hash password before saving
- userSchema.methods.comparePassword(): Compares plain text with hashed password
- bcrypt.genSalt(): Generates salt for password hashing
- bcrypt.hash(): Hashes password with salt
- bcrypt.compare(): Compares plain text password with hash
*/
