# Task Management System

A robust and scalable task management API built with Node.js, Express, and MongoDB, featuring Cloudinary integration for image management.

## Features

- JWT-based Authentication
- Role-based Access Control (Admin & Regular Users)
- CRUD Operations for Tasks
- Cloudinary Image Upload Integration
- Task Assignment System
- Advanced Filtering & Sorting
- Pagination Support
- Leaderboard System
- Comprehensive Test Suite

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT for Authentication
- Cloudinary for Image Management
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
├── services/
│   ├── authService.js
│   ├── taskService.js
│   └── cloudinaryService.js
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
3. Create a .env file based on .env.example and fill in your details:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Start the server:
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

#### Get Tasks (with filtering & sorting)
```http
GET /api/tasks
Authorization: Bearer <token>

Query Parameters:
- status: Task status (To Do, In Progress, Completed)
- priority: Task priority (Low, Medium, High)
- startDate: Filter tasks from this date
- endDate: Filter tasks until this date
- search: Search in title and description
- sortBy: Field to sort by (createdAt, dueDate, priority)
- sortOrder: Sort order (asc, desc)
- page: Page number for pagination
- limit: Number of items per page
- assignedTo: Filter by assigned user ID
- createdBy: Filter by creator user ID
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

1. **Service Layer Architecture**
   - Separation of concerns with dedicated service layer
   - Business logic isolated from controllers
   - Improved code reusability and maintainability

2. **Cloudinary Integration**
   - Secure and efficient image management
   - Automatic image optimization
   - CDN delivery for better performance

3. **Advanced Filtering & Sorting**
   - Comprehensive query parameters
   - Flexible search capabilities
   - Efficient pagination implementation

4. **Security**
   - JWT-based authentication
   - Role-based access control
   - Secure file upload handling
   - Input validation and sanitization

## Error Handling

The API implements comprehensive error handling:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- File upload errors
- Cloudinary integration errors

## Future Improvements

1. Implement rate limiting
2. Add request validation middleware
3. Implement caching
4. Add webhook support for notifications
5. Implement soft delete for tasks
6. Add support for task categories/tags
7. Implement real-time notifications using WebSockets
8. Add file type validation and virus scanning
9. Implement task comments and activity log
