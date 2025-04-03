const Task = require('../models/Task');
const User = require('../models/User');
const taskService = require('../services/taskService');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body, req.user._id, req.file);
        res.status(201).json({
            success: true,
            message: "🚀 Task created successfully! Let's get things done!",
            data: task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "😅 Oops! " + error.message
        });
    }
};

// Get all tasks (with filtering and sorting)
exports.getTasks = async (req, res) => {
    try {
        const result = await taskService.getTasks(req.query, req.user);
        res.json({
            success: true,
            message: "📋 Here's your task list!",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "🤖 System hiccup! " + error.message
        });
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

        res.json({
            success: true,
            message: req.body.status === 'Completed' 
                ? "🎉 Amazing job completing the task!"
                : "✏️ Task updated successfully!",
            data: task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "😕 Couldn't update that task: " + error.message
        });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        await taskService.deleteTask(
            req.params.id,
            req.user._id,
            req.user.role
        );
        res.json({
            success: true,
            message: "🗑️ Task deleted successfully! Keeping things tidy!"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "❌ Couldn't delete that task: " + error.message
        });
    }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await taskService.getLeaderboard();
        res.json({
            success: true,
            message: "🏆 Here's your productivity champions!",
            data: leaderboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "📊 Couldn't fetch leaderboard: " + error.message
        });
    }
};

// Get assigned tasks
exports.getAssignedTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAssignedTasks(req.user._id, req.query);
        res.json({
            success: true,
            message: "📥 Here are your assigned tasks!",
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "📭 Couldn't fetch assigned tasks: " + error.message
        });
    }
};

// Get task notifications
exports.getTaskNotifications = async (req, res) => {
    try {
        const notifications = await taskService.getTaskNotifications(req.user._id);
        res.json({
            success: true,
            message: "🔔 Here's what's new!",
            data: notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "🔕 Couldn't fetch notifications: " + error.message
        });
    }
};

// Get user stats
exports.getUserStats = async (req, res) => {
    try {
        const stats = await taskService.getUserStats(req.user._id);
        const completionRate = Math.round(stats.completionRate);
        let message = "📊 Here are your stats! ";
        
        if (completionRate >= 90) {
            message += "🌟 You're crushing it!";
        } else if (completionRate >= 70) {
            message += "💪 Great progress!";
        } else if (completionRate >= 50) {
            message += "👍 Keep going!";
        } else {
            message += "🌱 You're just getting started!";
        }

        res.json({
            success: true,
            message,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "📉 Couldn't fetch stats: " + error.message
        });
    }
};
