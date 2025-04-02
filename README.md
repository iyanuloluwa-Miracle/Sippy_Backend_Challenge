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
    "image": <file>  // Optional
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
