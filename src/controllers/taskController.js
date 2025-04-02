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
