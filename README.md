# Task Management System

A user-friendly task management system that helps teams organize and track their work efficiently.

## 📚 Table of Contents
- [For Users (Non-Technical)](#for-users-non-technical)
- [For Developers (Technical)](#for-developers-technical)
- [API Examples](#api-examples)
- [Technical Details](#technical-details)

## For Users (Non-Technical)

### What is This?
This is a task management system that helps you:
- Create and manage tasks
- Assign tasks to team members
- Track task progress
- Upload images to tasks
- See who's completing the most tasks

### Key Features
- ✅ Create tasks with titles, descriptions, and due dates
- 👥 Assign tasks to team members
- 🏷️ Set task priorities (Low, Medium, High)
- 📊 Track task status (To Do, In Progress, Completed)
- 🖼️ Add images to tasks
- 🏆 View team leaderboard
- 🔍 Search and filter tasks easily

### User Roles
1. **Regular Users Can:**
   - Create their own tasks
   - View and update their tasks
   - See tasks assigned to them
   - Upload images to tasks
   - View the leaderboard

2. **Administrators Can:**
   - Do everything regular users can
   - View and manage all tasks
   - Access system-wide reports

### Getting Started
1. Register for an account
2. Log in to the system
3. Start creating and managing tasks
4. Use the search and filter options to find tasks
5. Check the leaderboard to see top performers

## For Developers (Technical)

### Quick Start
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see Configuration section)
4. Start the server:
   ```bash
   npm start
   ```

### Configuration
Create a .env file with these variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## API Examples

### Authentication

#### Register a New User
```http
POST /api/auth/register
Content-Type: application/json

Request:
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "user"  // or "admin"
}

Response (201 Created):
{
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

Request:
{
    "email": "john@example.com",
    "password": "securePassword123"
}

Response (200 OK):
{
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token"
}
```

### Task Management

#### Create a Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: multipart/form-data

Request:
{
    "title": "Complete Project Proposal",
    "description": "Write and review Q2 project proposal",
    "priority": "High",
    "status": "To Do",
    "dueDate": "2024-04-15",
    "assignedTo": "user_id",
    "image": <file>  
}

Response (201 Created):
{
    "_id": "task_id",
    "title": "Complete Project Proposal",
    "description": "Write and review Q2 project proposal",
    "priority": "High",
    "status": "To Do",
    "dueDate": "2024-04-15",
    "creator": "creator_id",
    "assignedTo": "user_id",
    "imageUrl": "https://cloudinary.com/..."
}
```

#### Get Tasks with Filters
```http
GET /api/tasks?status=In Progress&priority=High&search=project&sortBy=dueDate&sortOrder=asc&page=1&limit=10
Authorization: Bearer <token>

Response (200 OK):
{
    "tasks": [
        {
            "_id": "task_id",
            "title": "Complete Project Proposal",
            "description": "Write and review Q2 project proposal",
            "priority": "High",
            "status": "In Progress",
            "dueDate": "2024-04-15",
            "creator": {
                "_id": "user_id",
                "name": "John Doe"
            },
            "assignedTo": {
                "_id": "user_id",
                "name": "Jane Smith"
            }
        }
    ],
    "pagination": {
        "total": 45,
        "page": 1,
        "pages": 5
    }
}
```

#### Update a Task
```http
PUT /api/tasks/:taskId
Authorization: Bearer <token>
Content-Type: multipart/form-data

Request:
{
    "status": "Completed",
    "priority": "Medium",
    "image": <file>  // Optional
}

Response (200 OK):
{
    "_id": "task_id",
    "title": "Complete Project Proposal",
    "status": "Completed",
    "priority": "Medium",
    "imageUrl": "https://cloudinary.com/..."
    // ... other fields
}
```

#### Delete a Task
```http
DELETE /api/tasks/:taskId
Authorization: Bearer <token>

Response (200 OK):
{
    "message": "Task removed successfully"
}
```

#### Get Leaderboard
```http
GET /api/tasks/leaderboard
Authorization: Bearer <token>

Response (200 OK):
[
    {
        "_id": "user_id",
        "name": "Jane Smith",
        "completedTasks": 25,
        "totalTasks": 30
    },
    {
        "_id": "user_id",
        "name": "John Doe",
        "completedTasks": 20,
        "totalTasks": 28
    }
]
```

### Common Error Responses

#### Authentication Errors
```http
Status: 401 Unauthorized
{
    "message": "Not authorized to access this route"
}
```

#### Validation Errors
```http
Status: 400 Bad Request
{
    "message": "Please provide all required fields"
}
```

#### Resource Not Found
```http
Status: 404 Not Found
{
    "message": "Task not found"
}
```

#### Permission Errors
```http
Status: 403 Forbidden
{
    "message": "User role is not authorized to access this route"
}
```

## Technical Details

### Architecture Overview
```
Client Request → JWT Auth → Route Handler → Service Layer → Database
                                        ↳ Cloudinary (for images)
```

### Database Schemas

#### User Schema
```javascript
{
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    completedTasks: { type: Number, default: 0 },
    totalTasks: { type: Number, default: 0 }
}
```

#### Task Schema
```javascript
{
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['To Do', 'In Progress', 'Completed'],
        default: 'To Do'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    dueDate: { type: Date, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    imageUrl: { type: String }
}
```

### Performance Optimizations
- Database indexing on frequently queried fields
- Pagination for large datasets
- Image optimization via Cloudinary
- Efficient query filtering

### Security Measures
- JWT authentication
- Password hashing
- Input validation
- File upload restrictions
- Role-based access control

### Testing
Run tests with:
```bash
npm test
```

Coverage includes:
- Authentication flows
- CRUD operations
- Error handling
- File uploads
- Access control

## 🚀 Task Management System: A Fun Way to Get Things Done!

Hey there! 👋 Welcome to our super cool Task Management System. Let me explain how this works in a way that's easy to understand, even if you're just starting out with coding!

## 🎯 What Does This App Do?

Imagine having a digital notebook where you can:
- ✍️ Create tasks (like "Finish homework" or "Build a rocket")
- 📋 Keep track of who's doing what
- 🎉 Celebrate when tasks are completed
- 📊 See cool stats about how productive everyone is
- 🔔 Get notified when something important happens

## 🏗️ How We Built It (The Cool Tech Stuff)

### 1. The Building Blocks (Libraries We Used)
```json
{
  "dependencies": {
    "express": "^4.18.2",        // Our main framework - like the foundation of a house
    "mongoose": "^7.0.3",        // Helps us talk to our database - like a super smart filing cabinet
    "jsonwebtoken": "^9.0.0",    // Keeps things secure - like a digital ID card
    "bcryptjs": "^2.4.3",        // Makes passwords super secret - like a secret code machine
    "multer": "^1.4.5-lts.1",    // Handles file uploads - like a digital post office
    "cloudinary": "^1.35.0",     // Stores our images - like a digital photo album
    "jest": "^29.5.0"            // Tests our code - like a quality checker
  }
}
```

### 2. How Data is Organized (Our Models)

#### User Model 👤
```javascript
{
    name: "John Doe",
    email: "john@example.com",
    password: "hashedPassword123",  // Super secret!
    role: "user" or "admin"        // Like a VIP pass
}
```

#### Task Model 📝
```javascript
{
    title: "Build a Robot",
    description: "Create an awesome robot helper",
    status: "To Do" | "In Progress" | "Completed",
    priority: "Low" | "Medium" | "High",
    dueDate: "2024-04-15",
    creator: userID,
    assignedTo: userID,
    imageUrl: "picture-of-robot.jpg"
}
```

#### Notification Model 🔔
```javascript
{
    userId: "who should see this",
    taskId: "which task this is about",
    type: "TASK_ASSIGNED" | "TASK_COMPLETED",
    read: false  // Like an unread message
}
```

### 3. How Things Work (The Cool Features)

#### Authentication (The Security Guard 🔐)
- **Register**: Create your account (like signing up for a game)
- **Login**: Get your special access token (like a VIP pass)
- **Special Admin Powers**: Some users get extra superpowers!

#### Tasks (The Main Event 🎮)
- **Create**: Make new tasks with titles, descriptions, and even pictures!
- **Update**: Change task details or mark them as done
- **Delete**: Remove tasks you don't need anymore
- **View**: See all your tasks in a nice list
- **Filter**: Find tasks by status, priority, or search words
- **Sort**: Arrange tasks by due date or priority

#### Special Features (The Extra Cool Stuff ✨)
1. **Image Upload**
   - Take pictures of your tasks
   - Images stored safely in the cloud
   - Like having a photo album for your tasks!

2. **Notifications**
   - Get notified when:
     - Someone assigns you a task
     - A task is completed
   - Like getting game notifications!

3. **Statistics & Leaderboard**
   - See how many tasks you've completed
   - Compare scores with others
   - Like a high-score board in games!

### 4. How We Keep Things Safe (Security 🛡️)

1. **Password Protection**
   - Passwords are scrambled (hashed) before saving
   - Like turning your password into a secret code

2. **Access Control**
   - Regular users can only see their own stuff
   - Admins can see everything
   - Like having different levels in a game

3. **Token System**
   - Get a special token when you log in
   - Use it to prove who you are
   - Like having a digital ID card

### 5. How We Know Everything Works (Testing 🧪)

We test everything! Like checking if a toy works before giving it to someone:

```javascript
// Example Test
describe('Create Task', () => {
    it('should create a new task successfully', async () => {
        // Try to create a task
        // Check if it worked
        // Make sure all the information is correct
    });
});
```

We test:
- ✅ User registration and login
- ✅ Creating, updating, and deleting tasks
- ✅ File uploads
- ✅ Notifications
- ✅ Statistics calculations

### 6. How to Try It Out (API Testing 🔧)

We made it super easy to test everything with ready-to-use examples:
- All API endpoints documented
- Example requests and responses
- Test with tools like Postman or simple curl commands

## 🎓 Cool Things We Learned

1. **Clean Code Structure**
   - Everything has its place
   - Easy to find and fix things
   - Like having a well-organized room!

2. **Service Layer Pattern**
   - Keeps business logic separate
   - Makes code reusable
   - Like building with LEGO blocks!

3. **Error Handling**
   - Friendly error messages
   - Clear instructions when something goes wrong
   - Like having a helpful guide!

## 🎮 How to Use It

1. **For Users**
   - Register/Login
   - Create and manage tasks
   - Track progress
   - Get notifications

2. **For Admins**
   - See all tasks and users
   - Check system statistics
   - Help manage everything

## 🚀 Future Ideas (What's Next?)

1. Real-time notifications (like instant messages)
2. Mobile app version
3. Task templates for common tasks
4. Team collaboration features
5. Time tracking for tasks

## 🎯 Why This is Awesome

1. **Easy to Use**: Simple and friendly interface
2. **Secure**: Keeps everything safe
3. **Scalable**: Can grow as needed
4. **Well-Tested**: Everything works reliably
5. **Modern**: Uses the latest tech

Remember: This isn't just a task manager - it's a fun way to organize work and celebrate achievements! 🎉
