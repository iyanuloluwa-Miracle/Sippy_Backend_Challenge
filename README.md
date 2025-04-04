# 🚀 Task Management System: A Fun Way to Get Things Done!

Hey there! 👋 Welcome to the Task Management System - a super cool way to keep track of tasks without losing your mind! Whether you're a solo hustler or part of a dream team, we've got you covered. 

---

## 📌 Quick Links
- **API Documentation:** [View in Postman](#)
- **Base URL:** `http://your-api.com`

---

## 📚 Table of Contents
- [For Users (Non-Technical)](#for-users-non-technical)
- [For Developers (Technical)](#for-developers-technical)
- [API Examples](#api-examples)
- [Technical Details](#technical-details)

---

## 👥 For Users (Non-Technical)
### 🎯 What Does This App Do?
Think of this as your digital task notebook but with superpowers! You can:

✅ Create and manage tasks 📝  
👥 Assign tasks to team members 📤  
📊 Track task status and priority 🔄  
🖼️ Upload images for visual references 📷  
🏆 Check out the leaderboard (who's bossing the tasks?) 🏅  
🔍 Search and filter tasks like a pro 🔎  

### 🏷️ User Roles
#### Regular Users Can:
- Create, update, and delete their own tasks
- Assign tasks to teammates
- Track progress and get notified
- Upload images to tasks
- View the leaderboard (flex on your teammates!)

#### Administrators Can:
- Do everything users can
- Manage all tasks system-wide
- Access productivity reports (who’s slacking?)

### 🛠 Getting Started
1. **Register** for an account ✍️  
2. **Log in** and get your personal dashboard 🔑  
3. **Start creating and managing tasks** ✅  
4. **Use filters** to find tasks easily 🕵️  
5. **Check the leaderboard** to see the top performers 🏆  

---

## 🛠 For Developers (Technical)
### ⚡ Quick Start
```bash
# Clone the repo
git clone https://github.com/your-repo/task-management-api.git
cd task-management-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the server
npm start
```

### 🔧 Configuration
Create a `.env` file with the following values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=super_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🌐 API Examples
### 🔐 Authentication
#### Register a New User
```http
POST /api/auth/register
```
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "user"
}
```

#### Login
```http
POST /api/auth/login
```
```json
{
    "email": "john@example.com",
    "password": "securePassword123"
}
```

### 📋 Task Management
#### Create a Task
```http
POST /api/tasks
```
```json
{
    "title": "Build a Robot",
    "description": "Create an awesome robot helper",
    "priority": "High",
    "status": "To Do",
    "dueDate": "2024-04-15",
    "assignedTo": "user_id"
}
```

#### Get Tasks with Filters
```http
GET /api/tasks?status=InProgress&priority=High&search=robot&page=1&limit=10
```

#### Update a Task
```http
PUT /api/tasks/:taskId
```
```json
{
    "status": "Completed",
    "priority": "Medium"
}
```

#### Delete a Task
```http
DELETE /api/tasks/:taskId
```
```json
{
    "message": "Task removed successfully"
}
```

#### Get Leaderboard
```http
GET /api/tasks/leaderboard
```
```json
[
    { "_id": "user1", "name": "Jane Smith", "completedTasks": 25, "totalTasks": 30 },
    { "_id": "user2", "name": "John Doe", "completedTasks": 20, "totalTasks": 28 }
]
```

---

## 🏗 Technical Details
### 🏛 Architecture Overview
```
Client Request → JWT Auth → Route Handler → Service Layer → Database
                                    ↳ Cloudinary (for images)
```

### 🗂 Database Schemas
#### 👤 User Schema
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "hashedPassword",
    "role": "user",
    "completedTasks": 5,
    "totalTasks": 10
}
```
#### 📝 Task Schema
```json
{
    "title": "Build a Robot",
    "description": "Create an awesome robot helper",
    "status": "In Progress",
    "priority": "High",
    "dueDate": "2024-04-15",
    "creator": "user_id",
    "assignedTo": "user_id",
    "imageUrl": "robot.jpg"
}
```
#### 🔔 Notification Schema
```json
{
    "userId": "user_id",
    "taskId": "task_id",
    "type": "TASK_ASSIGNED",
    "read": false
}
```

---

## 🔒 Security Measures
✅ **JWT Authentication** - Every request is verified 🔑  
✅ **Password Hashing** - Your password stays secret 🤫  
✅ **Role-Based Access** - Admins have extra superpowers 🦸  
✅ **Secure File Uploads** - No dodgy uploads here! 🚫  

---

## 🧪 Testing Strategy
We believe in "Test First, Debug Less!" 🧑‍🔬

```bash
npm test            # Run all tests
npm run test:unit   # Only unit tests
npm run test:int    # Only integration tests
```
✅ Unit tests for authentication, tasks, and middleware  
✅ Integration tests for database interactions and API responses  
✅ Mocked external services for reliability  


**🎉 Ready to Get Started?**
Go ahead, create some tasks, assign them, and watch the productivity soar! 🚀

