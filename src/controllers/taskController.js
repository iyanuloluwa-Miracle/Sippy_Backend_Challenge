const Task = require('../models/Task');
const User = require('../models/User');
const taskService = require('../services/taskService');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body, req.user._id, req.file);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all tasks (with filtering and sorting)
exports.getTasks = async (req, res) => {
    try {
        const result = await taskService.getTasks(req.query, req.user);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const task = await taskService.updateTask(
            req.params.id,
            req.body,
            req.user._id,
            req.user.role,
            req.file
        );

        // Send notification if task is assigned to someone
        if (req.body.assignedTo) {
            await taskService.createTaskNotification(task._id, req.body.assignedTo, 'TASK_ASSIGNED');
        }

        // Send notification if status is changed to completed
        if (req.body.status === 'Completed') {
            await taskService.createTaskNotification(task._id, task.creator, 'TASK_COMPLETED');
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const result = await taskService.deleteTask(
            req.params.id,
            req.user._id,
            req.user.role
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await taskService.getLeaderboard();
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get assigned tasks
exports.getAssignedTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAssignedTasks(req.user._id, req.query);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get task notifications
exports.getTaskNotifications = async (req, res) => {
    try {
        const notifications = await taskService.getTaskNotifications(req.user._id);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user stats
exports.getUserStats = async (req, res) => {
    try {
        const stats = await taskService.getUserStats(req.user._id);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
