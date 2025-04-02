const Task = require('../models/Task');
const User = require('../models/User');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            creator: req.user._id,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined
        });

        // Update user's task counts
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { totalTasks: 1 }
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all tasks (with filtering and sorting)
exports.getTasks = async (req, res) => {
    try {
        const query = {};
        const sort = {};

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Filter by priority
        if (req.query.priority) {
            query.priority = req.query.priority;
        }

        // Filter by due date range
        if (req.query.startDate && req.query.endDate) {
            query.dueDate = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        // Add user-specific filtering
        if (req.user.role !== 'admin') {
            query.$or = [
                { creator: req.user._id },
                { assignedTo: req.user._id }
            ];
        }

        // Sorting
        if (req.query.sortBy) {
            const sortField = req.query.sortBy.split(':')[0];
            const sortOrder = req.query.sortBy.split(':')[1] === 'desc' ? -1 : 1;
            sort[sortField] = sortOrder;
        }

        const tasks = await Task.find(query)
            .sort(sort)
            .populate('creator', 'name')
            .populate('assignedTo', 'name');

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check permission
        if (req.user.role !== 'admin' && 
            task.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Handle completion status change
        if (req.body.status === 'Completed' && task.status !== 'Completed') {
            await User.findByIdAndUpdate(task.creator, {
                $inc: { completedTasks: 1 }
            });
        } else if (req.body.status !== 'Completed' && task.status === 'Completed') {
            await User.findByIdAndUpdate(task.creator, {
                $inc: { completedTasks: -1 }
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { ...req.body, imageUrl: req.file ? `/uploads/${req.file.filename}` : task.imageUrl },
            { new: true }
        );

        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (req.user.role !== 'admin' && 
            task.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await task.remove();

        // Update user's task counts
        await User.findByIdAndUpdate(task.creator, {
            $inc: { 
                totalTasks: -1,
                completedTasks: task.status === 'Completed' ? -1 : 0
            }
        });

        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({})
            .select('name completedTasks totalTasks')
            .sort({ completedTasks: -1, totalTasks: 1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
