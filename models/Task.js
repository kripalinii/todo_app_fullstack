// Import mongoose for database modeling
const mongoose = require("mongoose")

// Define task schema structure
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      required: true,
      enum: ["Work", "Personal", "Shopping", "Health", "Other"],
      default: "Personal",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
)

// Create index for efficient querying by user and due date
taskSchema.index({ userId: 1, dueDate: 1 })

// Export Task model
module.exports = mongoose.model("Task", taskSchema)

/*
IMPORTANT VARIABLES:
- taskSchema: Mongoose schema defining task structure
- userId: Reference to the user who owns the task
- enum: Predefined list of allowed category values

MAJOR FUNCTIONS:
- taskSchema.index(): Creates database index for better query performance
- mongoose.model(): Creates and exports the Task model
*/
