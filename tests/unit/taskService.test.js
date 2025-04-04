const taskService = require('../../src/services/taskService');
const Task = require('../../models/Task');
const User = require('../../models/User');
const { createTestUser } = require('../utils/testHelpers');

describe('Task Service', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'To Do',
      };

      const task = await taskService.createTask(taskData, testUser._id);
      expect(task).toBeDefined();
      expect(task.title).toBe(taskData.title);
      expect(task.creator.toString()).toBe(testUser._id.toString());

      // Verify user's totalTasks was incremented
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.totalTasks).toBe(1);
    });
  });

  describe('getTasks', () => {
    it('should return tasks for a user', async () => {
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

      const result = await taskService.getTasks({}, testUser);
      expect(result.tasks.length).toBe(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should filter tasks by status', async () => {
      await Task.create([
        {
          title: 'Task 1',
          description: 'Desc 1',
          creator: testUser._id,
          status: 'To Do',
        },
        {
          title: 'Task 2',
          description: 'Desc 2',
          creator: testUser._id,
          status: 'Completed',
        },
      ]);

      const result = await taskService.getTasks({ status: 'Completed' }, testUser);
      expect(result.tasks.length).toBe(1);
      expect(result.tasks[0].status).toBe('Completed');
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const task = await Task.create({
        title: 'Original Task',
        description: 'Original Desc',
        creator: testUser._id,
      });

      const updatedData = {
        title: 'Updated Task',
        description: 'Updated Desc',
        status: 'In Progress',
      };

      const updatedTask = await taskService.updateTask(task._id, updatedData);
      expect(updatedTask.title).toBe(updatedData.title);
      expect(updatedTask.status).toBe(updatedData.status);
    });

    it('should update task status to completed and increment user completedTasks', async () => {
      const task = await Task.create({
        title: 'Task to Complete',
        description: 'Desc',
        creator: testUser._id,
      });

      const updatedTask = await taskService.updateTask(task._id, {
        status: 'Completed',
      });

      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.completedTasks).toBe(1);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const task = await Task.create({
        title: 'Task to Delete',
        description: 'Desc',
        creator: testUser._id,
      });

      await taskService.deleteTask(task._id);

      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();

      // Verify user's totalTasks was decremented
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.totalTasks).toBe(0);
    });
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard data', async () => {
      // Create test users with different completion rates
      await User.create([
        {
          name: 'User 1',
          email: 'user1@example.com',
          password: 'password',
          completedTasks: 5,
          totalTasks: 10,
        },
        {
          name: 'User 2',
          email: 'user2@example.com',
          password: 'password',
          completedTasks: 8,
          totalTasks: 10,
        },
      ]);

      const leaderboard = await taskService.getLeaderboard();
      expect(leaderboard.length).toBe(2);
      expect(leaderboard[0].completionRate).toBeGreaterThanOrEqual(
        leaderboard[1].completionRate
      );
    });
  });
});