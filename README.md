# 🚀 Task Management System

A robust and secure task management API built with Node.js, Express, and MongoDB.

## 📌 Quick Links

- 📄 **API Documentation:** [View in Postman](https://documenter.getpostman.com/view/29992846/2sB2cSiQ4q)  
- 🌐 **Base URL:** [`https://sippy-task-management-challenge.onrender.com`](https://sippy-task-management-challenge.onrender.com)


## 📋 Table of Contents
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Design Decisions](#design-decisions)
- [Testing](#testing)
- [Security Measures](#security-measures)
- [Database Design](#database-design)
- [Performance Optimizations](#performance-optimizations)

## ✨ Features
- 🔐 JWT Authentication
- 👥 Role-based access control
- 📝 CRUD operations for tasks
- 🔄 Task status management
- 📊 Task priority levels
- 🖼️ Image upload support
- 📈 Leaderboard system
- 🔍 Advanced search and filtering
- 📱 Responsive API design

## 🛠 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/task-management-system.git
cd task-management-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the server
npm start
```

### Environment Variables
Create a `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

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
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "securePassword123"
}
```

### Task Endpoints

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Build a Robot",
    "description": "Create an awesome robot helper",
    "priority": "High",
    "status": "To Do",
    "dueDate": "2024-04-15",
    "assignedTo": "user_id"
}
```

#### Get Tasks
```http
GET /api/tasks?status=InProgress&priority=High&search=robot&page=1&limit=10
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /api/tasks/:taskId
Authorization: Bearer <token>
Content-Type: application/json

{
    "status": "Completed",
    "priority": "Medium"
}
```

#### Delete Task
```http
DELETE /api/tasks/:taskId
Authorization: Bearer <token>
```

#### Get Leaderboard
```http
GET /api/tasks/leaderboard
Authorization: Bearer <token>
```

## 🎯 Design Decisions

### Architecture
- **MVC Pattern**: Separated concerns into Models, Controllers, and Services
- **Middleware-based Authentication**: JWT-based auth with role-based access control
- **Service Layer**: Business logic isolated in service layer for better maintainability
- **Error Handling**: Centralized error handling with custom error classes

### Database Design
- **MongoDB**: Chosen for flexibility and scalability
- **Schema Design**: Optimized for task management with proper indexing
- **Relationships**: Maintained through references while keeping flexibility

### API Design
- **RESTful Principles**: Followed REST conventions for intuitive API design
- **Pagination**: Implemented for efficient data retrieval
- **Filtering**: Advanced search and filter capabilities
- **Response Format**: Consistent JSON response structure

## 🧪 Testing

### Test Coverage
```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:int

# Generate coverage report
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Testing individual components in isolation
- **Integration Tests**: Testing API endpoints and database interactions
- **Mocking**: External services mocked for reliable testing

## 🔒 Security Measures

### Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Token expiration and refresh mechanism

### Data Protection
- Input validation and sanitization
- XSS protection
- CORS configuration
- Rate limiting

### File Upload Security
- File type validation
- Size restrictions
- Secure cloud storage
- Virus scanning (optional)

## 💾 Database Design

### Collections
1. **Users**
   - Basic user information
   - Authentication details
   - Task statistics

2. **Tasks**
   - Task details
   - Status and priority
   - Creator and assignee references
   - Image references

3. **Notifications**
   - User notifications
   - Task-related alerts
   - Read status tracking

### Indexing Strategy
- Compound indexes for frequent queries
- Text indexes for search functionality
- Unique indexes for email and username

## ⚡ Performance Optimizations

### Database
- Efficient indexing
- Query optimization
- Aggregation pipeline optimization

### API
- Response caching
- Pagination implementation
- Selective field projection

### Image Handling
- Cloudinary integration
- Image optimization
- Lazy loading support



## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
