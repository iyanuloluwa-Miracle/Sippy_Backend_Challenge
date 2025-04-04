const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

describe('Task Management Tests', () => {
  let mongoServer;
  let userToken, adminToken;
  let userId, adminId;
  let userTaskId, adminTaskId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create test users
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'user@test.com',
        password: 'userpass123',
        role: 'user'
      });
    userToken = userRes.body.token;
    userId = userRes.body._id;

    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'adminpass123',
        role: 'admin'
      });
    adminToken = adminRes.body.token;
    adminId = adminRes.body._id;

    // Create test tasks
    const userTask = await Task.create({
      title: 'User Task',
      description: 'Created by regular user',
      creator: userId,
      status: 'To Do'
    });
    userTaskId = userTask._id;

    const adminTask = await Task.create({
      title: 'Admin Task',
      description: 'Created by admin',
      creator: adminId,
      status: 'To Do'
    });
    adminTaskId = adminTask._id;
  });

  describe('Task Creation', () => {
    it('should create a task for authenticated user', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'New Task',
          description: 'Test description',
          status: 'To Do'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.creator).toBe(userId);
    });

    it('should reject task creation without authentication', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'New Task',
          description: 'Test description'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Task Retrieval', () => {
    it('should get only user-owned tasks for regular users', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].creator._id).toBe(userId);
    });

    it('should get all tasks for admin users', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.tasks.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Task Updates', () => {
    it('should allow user to update own task', async () => {
      const response = await request(app)
        .put(`/api/tasks/${userTaskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'In Progress' });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('In Progress');
    });

    it('should prevent user from updating admin task', async () => {
      const response = await request(app)
        .put(`/api/tasks/${adminTaskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'In Progress' });

      expect(response.status).toBe(403);
    });

    it('should allow admin to update any task', async () => {
      const response = await request(app)
        .put(`/api/tasks/${userTaskId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Completed' });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('Completed');
    });
  });

  describe('Task Deletion', () => {
    it('should allow user to delete own task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${userTaskId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      
      const task = await Task.findById(userTaskId);
      expect(task).toBeNull();
    });

    it('should prevent user from deleting admin task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${adminTaskId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      
      const task = await Task.findById(adminTaskId);
      expect(task).not.toBeNull();
    });

    it('should allow admin to delete any task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${userTaskId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      const task = await Task.findById(userTaskId);
      expect(task).toBeNull();
    });
  });
});