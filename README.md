# Task Management System

A robust and scalable task management API built with Node.js, Express, and MongoDB.

## Features

- JWT-based Authentication
- Role-based Access Control (Admin & Regular Users)
- CRUD Operations for Tasks
- Image Upload Support
- Task Assignment System
- Filtering & Sorting Capabilities
- Leaderboard System
- Comprehensive Test Suite

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT for Authentication
- Multer for File Upload
- Jest for Testing

## Project Structure

```
src/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   └── taskController.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── models/
│   ├── User.js
│   └── Task.js
├── routes/
│   ├── authRoutes.js
│   └── taskRoutes.js
└── app.js
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Tasks
- GET /api/tasks - Get all tasks (with filtering & sorting)
- POST /api/tasks - Create a new task
- PUT /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task
- GET /api/tasks/leaderboard - Get user leaderboard

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```
4. Create an 'uploads' directory in the root folder:
   ```bash
   mkdir uploads
   ```
5. Start the server:
   ```bash
   npm start
   ```

## Running Tests

```bash
npm test
```

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Tasks

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Task Title",
  "description": "Task Description",
  "priority": "High",
  "dueDate": "2023-12-31",
  "image": <file>
}
```

#### Get Tasks
```http
GET /api/tasks?status=In Progress&priority=High&sortBy=dueDate:desc
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "status": "Completed",
  "priority": "Low",
  "image": <file>
}
```

## Design Decisions

1. **Authentication & Authorization**
   - JWT-based authentication for stateless and scalable auth
   - Role-based access control for different user privileges

2. **Database Schema**
   - Efficient schema design with proper indexing
   - Separate models for Users and Tasks with references

3. **File Upload**
   - Multer middleware for handling multipart/form-data
   - Local storage for uploaded files (can be extended to cloud storage)

4. **Performance Optimization**
   - Indexed fields for faster queries
   - Efficient filtering and sorting implementation
   - Pagination support for large datasets

5. **Security**
   - Password hashing using bcrypt
   - JWT for secure authentication
   - Input validation and sanitization
   - Protected routes and role-based access

## Error Handling

The API implements comprehensive error handling:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- File upload errors

## Future Improvements

1. Implement rate limiting
2. Add request validation middleware
3. Implement caching
4. Add webhook support for notifications
5. Implement soft delete for tasks
6. Add support for task categories/tags
