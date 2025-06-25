# Full-Stack Todo List Application

A beginner-friendly full-stack web application built with vanilla HTML, CSS, JavaScript on the frontend and Node.js/Express/MongoDB on the backend.

## 📋 Features

### Authentication
- User registration and login
- Password hashing with bcryptjs
- JWT-based session management
- Secure logout functionality

### Task Management
- Create, read, update, and delete tasks
- Task properties: title, description, category, due date, completion status
- Filter tasks by category and completion status
- Sort tasks by due date, category, or creation date

### User Interface
- Clean, responsive design
- Dark mode toggle
- Daily progress tracking with visual progress bar
- Color-coded task status (overdue, due today, completed)
- Modal-based task editing

### Categories
- Work
- Personal
- Shopping
- Health
- Other

## 🛠️ Tech Stack

### Frontend
- HTML5 (vanilla)
- CSS3 (vanilla, no frameworks)
- JavaScript (vanilla, ES6+)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## 📁 Project Structure

\`\`\`
todo-app-fullstack/
├── server.js                 # Main server file
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables
├── models/
│   ├── User.js             # User database schema
│   └── Task.js             # Task database schema
├── controllers/
│   ├── authController.js   # Authentication logic
│   └── taskController.js   # Task management logic
├── routes/
│   ├── auth.js            # Authentication routes
│   └── tasks.js           # Task management routes
├── middleware/
│   └── authMiddleware.js  # JWT verification middleware
└── public/
    ├── index.html         # Login/Register page
    ├── dashboard.html     # Main application page
    ├── style.css         # All application styles
    └── script.js         # Frontend JavaScript logic
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation
1. Clone or download the project files
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Set up environment variables in `.env` file
4. Start MongoDB service (if using local installation)
5. Run the application:
   \`\`\`bash
   npm start
   \`\`\`
   Or for development with auto-restart:
   \`\`\`bash
   npm run dev
   \`\`\`

### Usage
1. Open your browser and navigate to `http://localhost:3000`
2. Register a new account or login with existing credentials
3. Start creating and managing your tasks!

## 🎯 Key Features Explained

### Progress Tracking
- Shows daily task completion progress
- Visual progress bar with percentage
- Updates in real-time as tasks are completed

### Task Status Visualization
- **Red border**: Overdue tasks
- **Yellow border**: Tasks due today
- **Green border**: Completed tasks
- **Blue border**: Regular pending tasks

### Dark Mode
- Toggle between light and dark themes
- Preference saved in browser localStorage
- Smooth transitions between themes

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly buttons and interactions

## 🔒 Security Features

- Password hashing with salt
- JWT token-based authentication
- Input validation and sanitization
- XSS prevention through HTML escaping
- CORS protection

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🎓 Learning Objectives

This project demonstrates:
- Full-stack web development principles
- RESTful API design
- Database modeling with MongoDB
- Authentication and authorization
- Frontend-backend communication
- Responsive web design
- Modern JavaScript (ES6+)
- MVC architecture pattern

## 🤝 Contributing

This is a beginner-friendly project perfect for learning and portfolio use. Feel free to:
- Add new features
- Improve the UI/UX
- Optimize performance
- Add more task categories
- Implement additional filters

---

*Built with ❤️ for learning and portfolio purposes*
