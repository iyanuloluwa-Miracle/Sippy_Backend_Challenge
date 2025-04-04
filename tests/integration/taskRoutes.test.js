const request = require('supertest');
const app = require('../../src/app');
const Task = require('../../src/models/Task');
const User = require('../../src/models/User');
const { createTestUser, getAuthToken } = require('../utils/testHelpers');

describe('Task Routes', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = getAuthToken(testUser._id);
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Integration Task',
        description: 'Integration Test Description',
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);

      // Verify task was saved in database
      const task = await Task.findOne({ title: taskData.title });
      expect(task).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const taskData = {
        title: 'Unauthorized Task',
        description: 'Should fail',
      };

      await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(401);
    });
  });

  describe('GET /api/tasks', () => {
    it('should return tasks for authenticated user', async () => {
      // Create test tasks
      await Task.create([
        {
          title: 'Task 1',
          description: 'Desc 1',
          creator: testUser._id,
        },
        {
          title: 'Task 2',
          description: 'Desc 2',
          creator: testUser._id,
        },
      ]);

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks.length).toBe(2);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const task = await Task.create({
        title: 'Task to Update',
        description: 'Original Desc',
        creator: testUser._id,
      });

      const updateData = {
        title: 'Updated Task',
        description: 'Updated Desc',
        status: 'In Progress',
      };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);

      // Verify task was updated in database
      const updatedTask = await Task.findById(task._id);
      expect(updatedTask.title).toBe(updateData.title);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await Task.create({
        title: 'Task to Delete',
        description: 'Desc',
        creator: testUser._id,
      });

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify task was deleted from database
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });
  });
});