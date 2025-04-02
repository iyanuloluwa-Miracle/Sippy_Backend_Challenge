const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

let mongoServer;
let authToken;
let userId;
let taskId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create a test user and get token
    const userResponse = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Test User',
            email: 'test@test.com',
            password: 'password123'
        });
    
    authToken = userResponse.body.token;
    userId = userResponse.body._id;
});

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@test.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login user', async () => {
        // Create user first
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@test.com',
                password: 'password123'
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@test.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});

describe('Task Management Tests', () => {
    describe('POST /api/tasks', () => {
        it('should create a new task for authenticated user', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .field('title', 'Test Task')
                .field('description', 'Test Description')
                .field('priority', 'High')
                .field('status', 'To Do')
                .field('dueDate', '2024-12-31')
                .attach('image', 'tests/fixtures/test-image.jpg')
                .expect(201);

            const task = await Task.findById(response.body._id);
            expect(task).not.toBeNull();
            expect(task.imageUrl).toBeDefined();
        });

        it('should not create task with invalid data', async () => {
            await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);
        });

        it('should not create task without authentication', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .send({
                    title: 'Test Task',
                    description: 'Test Description',
                    priority: 'High',
                    dueDate: new Date()
                });

            expect(res.statusCode).toBe(401);
        });

        it('should validate required fields', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    description: 'Test Description'
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/tasks', () => {
        beforeEach(async () => {
            // Create test tasks
            await Task.create([
                {
                    title: 'Task 1',
                    description: 'Description 1',
                    priority: 'High',
                    status: 'To Do',
                    dueDate: new Date(),
                    creator: userId
                },
                {
                    title: 'Task 2',
                    description: 'Description 2',
                    priority: 'Low',
                    status: 'Completed',
                    dueDate: new Date(),
                    creator: userId
                }
            ]);
        });

        it('should get all tasks for user', async () => {
            const res = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.tasks).toHaveLength(2);
            expect(res.body).toHaveProperty('pagination');
        });

        it('should filter tasks by status', async () => {
            const res = await request(app)
                .get('/api/tasks')
                .query({ status: 'Completed' })
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.tasks).toHaveLength(1);
            expect(res.body.tasks[0].status).toBe('Completed');
        });

        it('should filter tasks by priority', async () => {
            const res = await request(app)
                .get('/api/tasks')
                .query({ priority: 'High' })
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.tasks[0].priority).toBe('High');
        });

        it('should sort tasks', async () => {
            const res = await request(app)
                .get('/api/tasks')
                .query({ sortBy: 'priority', sortOrder: 'desc' })
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.tasks[0].priority).toBe('High');
        });

        it('should paginate results', async () => {
            const res = await request(app)
                .get('/api/tasks')
                .query({ page: 1, limit: 1 })
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.tasks).toHaveLength(1);
            expect(res.body.pagination.total).toBe(2);
        });
    });

    describe('PUT /api/tasks/:id', () => {
        let taskId;

        beforeEach(async () => {
            const task = await Task.create({
                title: 'Test Task',
                description: 'Test Description',
                priority: 'High',
                status: 'To Do',
                dueDate: new Date(),
                creator: userId
            });
            taskId = task._id;
        });

        it('should update task', async () => {
            const res = await request(app)
                .put(`/api/tasks/${taskId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Updated Task',
                    status: 'Completed'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.title).toBe('Updated Task');
            expect(res.body.status).toBe('Completed');
        });

        it('should not update task without authentication', async () => {
            const res = await request(app)
                .put(`/api/tasks/${taskId}`)
                .send({
                    title: 'Updated Task'
                });

            expect(res.statusCode).toBe(401);
        });

        it('should not update non-existent task', async () => {
            const res = await request(app)
                .put(`/api/tasks/${new mongoose.Types.ObjectId()}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Updated Task'
                });

            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /api/tasks/:id', () => {
        let taskId;

        beforeEach(async () => {
            const task = await Task.create({
                title: 'Test Task',
                description: 'Test Description',
                priority: 'High',
                status: 'To Do',
                dueDate: new Date(),
                creator: userId
            });
            taskId = task._id;
        });

        it('should delete task', async () => {
            const res = await request(app)
                .delete(`/api/tasks/${taskId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            
            const deletedTask = await Task.findById(taskId);
            expect(deletedTask).toBeNull();
        });

        it('should not delete task without authentication', async () => {
            const res = await request(app)
                .delete(`/api/tasks/${taskId}`);

            expect(res.statusCode).toBe(401);
        });

        it('should not delete non-existent task', async () => {
            const res = await request(app)
                .delete(`/api/tasks/${new mongoose.Types.ObjectId()}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('GET /api/tasks/leaderboard', () => {
        beforeEach(async () => {
            // Create another user with different completion rates
            const user2 = await User.create({
                name: 'Test User 2',
                email: 'test2@test.com',
                password: 'password123',
                completedTasks: 5,
                totalTasks: 8
            });

            await User.findByIdAndUpdate(userId, {
                completedTasks: 3,
                totalTasks: 10
            });
        });

        it('should get leaderboard', async () => {
            const res = await request(app)
                .get('/api/tasks/leaderboard')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body).toHaveLength(2);
            expect(res.body[0].completedTasks).toBe(5); // User with more completed tasks should be first
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .get('/api/tasks/leaderboard');

            expect(res.statusCode).toBe(401);
        });
    });
});
