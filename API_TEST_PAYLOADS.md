# API Test Payloads

This document contains sample payloads for testing all API endpoints.

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePass123",
    "role": "user"  // or "admin"
}

Response (201 Created):
{
    "success": true,
    "message": "🎉 Welcome aboard! Your account has been created successfully!",
    "data": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
    }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "securePass123"
}

Response (200 OK):
{
    "success": true,
    "message": "👋 Welcome back, John! Ready to be productive?",
    "data": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "token": "jwt_token"
    }
}
```

## Task Management Endpoints

### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "Complete Project Proposal"
- description: "Write and review Q2 project proposal"
- priority: "High"  // Options: Low, Medium, High
- status: "To Do"   // Options: To Do, In Progress, Completed
- dueDate: "2024-04-15"
- assignedTo: "user_id"  // Optional
- image: <file>          // Optional

Response (201 Created):
{
    "success": true,
    "message": "🚀 Task created successfully! Let's get things done!",
    "data": {
        "_id": "task_id",
        "title": "Complete Project Proposal",
        "description": "Write and review Q2 project proposal",
        "priority": "High",
        "status": "To Do",
        "dueDate": "2024-04-15",
        "creator": {
            "_id": "user_id",
            "name": "John Doe"
        },
        "assignedTo": {
            "_id": "user_id",
            "name": "Jane Smith"
        },
        "imageUrl": "https://cloudinary.com/..."
    }
}
```

### Get Tasks (with filters)
```http
GET /api/tasks?status=In Progress&priority=High&search=project&sortBy=dueDate&sortOrder=asc&page=1&limit=10
Authorization: Bearer <token>

Query Parameters:
- status: Task status (To Do, In Progress, Completed)
- priority: Task priority (Low, Medium, High)
- search: Search in title and description
- sortBy: Field to sort by (createdAt, dueDate, priority)
- sortOrder: Sort order (asc, desc)
- page: Page number
- limit: Items per page
- startDate: Filter tasks from this date (YYYY-MM-DD)
- endDate: Filter tasks until this date (YYYY-MM-DD)

Response (200 OK):
{
    "success": true,
    "message": "📋 Here are your tasks!",
    "data": {
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
}
```

### Update Task
```http
PUT /api/tasks/:taskId
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "Updated Project Proposal"        // Optional
- description: "Updated description"       // Optional
- priority: "Medium"                       // Optional
- status: "Completed"                      // Optional
- dueDate: "2024-04-20"                   // Optional
- assignedTo: "user_id"                    // Optional
- image: <file>                           // Optional

Response (200 OK):
{
    "success": true,
    "message": "📝 Task updated successfully!",
    "data": {
        "_id": "task_id",
        "title": "Updated Project Proposal",
        "status": "Completed",
        "priority": "Medium",
        "imageUrl": "https://cloudinary.com/..."
        // ... other fields
    }
}
```

### Delete Task
```http
DELETE /api/tasks/:taskId
Authorization: Bearer <token>

Response (200 OK):
{
    "success": true,
    "message": "🚮 Task removed successfully!"
}
```

### Get Assigned Tasks
```http
GET /api/tasks/assigned?status=In Progress&priority=High&page=1&limit=10
Authorization: Bearer <token>

Query Parameters:
- status: Filter by status
- priority: Filter by priority
- page: Page number
- limit: Items per page

Response (200 OK):
{
    "success": true,
    "message": "📋 Here are your assigned tasks!",
    "data": {
        "tasks": [
            {
                "_id": "task_id",
                "title": "Task Title",
                "status": "In Progress",
                "priority": "High",
                // ... other task fields
            }
        ],
        "pagination": {
            "total": 25,
            "page": 1,
            "pages": 3
        }
    }
}
```

### Get Task Notifications
```http
GET /api/tasks/notifications
Authorization: Bearer <token>

Response (200 OK):
{
    "success": true,
    "message": "📣 Here are your task notifications!",
    "data": [
        {
            "_id": "notification_id",
            "taskId": {
                "_id": "task_id",
                "title": "Task Title"
            },
            "type": "TASK_ASSIGNED",
            "read": false,
            "createdAt": "2024-04-02T10:00:00.000Z"
        }
    ]
}
```

### Get User Stats
```http
GET /api/tasks/stats
Authorization: Bearer <token>

Response (200 OK):
{
    "success": true,
    "message": "📊 Here are your stats!",
    "data": {
        "totalCreated": 45,
        "completedCreated": 30,
        "totalAssigned": 20,
        "completedAssigned": 15,
        "completionRate": 66.67
    }
}
```

### Get Leaderboard
```http
GET /api/tasks/leaderboard
Authorization: Bearer <token>

Response (200 OK):
{
    "success": true,
    "message": "🏆 Here's the leaderboard!",
    "data": [
        {
            "_id": "user_id",
            "name": "Jane Smith",
            "completedTasks": 25,
            "totalTasks": 30,
            "completionRate": 83.33
        },
        {
            "_id": "user_id",
            "name": "John Doe",
            "completedTasks": 20,
            "totalTasks": 28,
            "completionRate": 71.43
        }
    ]
}
```

## Admin-Specific Operations

### Register Admin User
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "adminpass123",
    "role": "admin"
}

Response (201 Created):
{
    "success": true,
    "message": "🎉 Welcome aboard, Admin! Your super-powered account is ready!",
    "data": {
        "_id": "user_id",
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin"
    }
}
```

### Admin: View All Tasks (including other users' tasks)
```http
GET /api/tasks
Authorization: Bearer <admin_token>

Response (200 OK):
{
    "success": true,
    "message": "📋 Here's the complete task list, boss!",
    "data": {
        "tasks": [
            {
                "_id": "task_id",
                "title": "Task Title",
                "description": "Task Description",
                "status": "In Progress",
                "priority": "High",
                "creator": {
                    "_id": "user_id",
                    "name": "John Doe"
                },
                "assignedTo": {
                    "_id": "user_id",
                    "name": "Jane Smith"
                }
            }
            // ... more tasks
        ],
        "pagination": {
            "total": 100,
            "page": 1,
            "pages": 10
        }
    }
}
```

### Admin: Update Any Task
```http
PUT /api/tasks/:taskId
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- status: "Completed"
- priority: "High"
- assignedTo: "user_id"

Response (200 OK):
{
    "success": true,
    "message": "📝 Task updated successfully!",
    "data": {
        "_id": "task_id",
        "title": "Task Title",
        "status": "Completed",
        "priority": "High",
        "assignedTo": {
            "_id": "user_id",
            "name": "Jane Smith"
        }
    }
}
```

### Admin: Delete Any Task
```http
DELETE /api/tasks/:taskId
Authorization: Bearer <admin_token>

Response (200 OK):
{
    "success": true,
    "message": "🚮 Task removed successfully!"
}
```

### Admin: View System Statistics
```http
GET /api/tasks/stats
Authorization: Bearer <admin_token>

Response (200 OK):
{
    "success": true,
    "message": "📊 Here's your system overview, commander!",
    "data": {
        "totalUsers": 50,
        "totalTasks": 200,
        "completedTasks": 150,
        "systemCompletionRate": 75,
        "userStats": [
            {
                "userId": "user_id",
                "name": "John Doe",
                "totalTasks": 30,
                "completedTasks": 25,
                "completionRate": 83.33
            }
            // ... more user stats
        ]
    }
}
```

## Testing with Curl

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"securePass123","role":"user"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"securePass123"}'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -F "title=Test Task" \
  -F "description=Test Description" \
  -F "priority=High" \
  -F "status=To Do" \
  -F "dueDate=2024-04-15" \
  -F "image=@/path/to/image.jpg"
```

### Get Tasks
```bash
curl -X GET "http://localhost:5000/api/tasks?status=In%20Progress&priority=High" \
  -H "Authorization: Bearer <token>"
```

### Update Task
```bash
curl -X PUT http://localhost:5000/api/tasks/:taskId \
  -H "Authorization: Bearer <token>" \
  -F "status=Completed" \
  -F "priority=Medium"
```

### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/:taskId \
  -H "Authorization: Bearer <token>"
```

### Testing Admin Functionality with Curl

### Register Admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "adminpass123",
    "role": "admin"
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpass123"
  }'
```

### Admin View All Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <admin_token>"
```

### Admin Update Any Task
```bash
curl -X PUT http://localhost:5000/api/tasks/:taskId \
  -H "Authorization: Bearer <admin_token>" \
  -F "status=Completed" \
  -F "priority=High" \
  -F "assignedTo=user_id"
```

### Admin Delete Any Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/:taskId \
  -H "Authorization: Bearer <admin_token>"
```

## Testing Steps for Admin

1. First, register an admin account:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "adminpass123",
    "role": "admin"
  }'
```

2. Login with admin credentials and save the token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpass123"
  }'
```

3. Use the admin token for subsequent requests:
```bash
# View all tasks in the system
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <admin_token>"

# Update any user's task
curl -X PUT http://localhost:5000/api/tasks/:taskId \
  -H "Authorization: Bearer <admin_token>" \
  -F "status=Completed"

# View system statistics
curl -X GET http://localhost:5000/api/tasks/stats \
  -H "Authorization: Bearer <admin_token>"
```

### Key Differences Between Admin and Regular Users

1. **Task Visibility**:
   - Regular users can only see their own tasks and tasks assigned to them
   - Admins can see all tasks in the system

2. **Task Management**:
   - Regular users can only modify their own tasks
   - Admins can modify any task

3. **Statistics Access**:
   - Regular users can only see their own stats
   - Admins can see system-wide statistics

4. **User Management**:
   - Regular users have no user management capabilities
   - Admins can view all user statistics and task assignments

## Common Error Responses

### Authentication Error
```http
Status: 401 Unauthorized
{
    "success": false,
    "message": "🔒 Oops! You need to login first!"
}
```

### Validation Error
```http
Status: 400 Bad Request
{
    "success": false,
    "message": "😅 Oops! Please provide all required fields"
}
```

### Resource Not Found
```http
Status: 404 Not Found
{
    "success": false,
    "message": "Task not found"
}
```

### Permission Error
```http
Status: 403 Forbidden
{
    "success": false,
    "message": "🚫 Sorry, you don't have permission for this action"
}
```
