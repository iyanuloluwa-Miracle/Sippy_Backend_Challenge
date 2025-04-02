const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');
const cloudinaryService = require('./cloudinaryService');

class TaskService {
    async createTask(taskData, userId, file) {
        const task = new Task({
            ...taskData,
            creator: userId
        });

        if (file) {
            task.imageUrl = await cloudinaryService.uploadImage(file);
        }

        await task.save();

        // Update user's task count
        await User.findByIdAndUpdate(userId, {
            $inc: { totalTasks: 1 }
        });

        return task;
    }

    async getTasks(query, user) {
        const {
            status,
            priority,
            startDate,
            endDate,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 10
        } = query;

        const filter = {};

        // Regular users can only see their tasks or tasks assigned to them
        if (user.role !== 'admin') {
            filter.$or = [
                { creator: user._id },
                { assignedTo: user._id }
            ];
        }

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (startDate || endDate) {
            filter.dueDate = {};
            if (startDate) filter.dueDate.$gte = new Date(startDate);
            if (endDate) filter.dueDate.$lte = new Date(endDate);
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        const [tasks, total] = await Promise.all([
            Task.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .populate('creator', 'name')
                .populate('assignedTo', 'name'),
            Task.countDocuments(filter)
        ]);

        return {
            tasks,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        };
    }

    async updateTask(taskId, updateData, userId, userRole, file) {
        const task = await Task.findById(taskId);
        if (!task) throw new Error('Task not found');

        // Check authorization
        if (userRole !== 'admin' && task.creator.toString() !== userId) {
            throw new Error('Not authorized to update this task');
        }

        // Handle image update
        if (file) {
            if (task.imageUrl) {
                await cloudinaryService.deleteImage(task.imageUrl);
            }
            updateData.imageUrl = await cloudinaryService.uploadImage(file);
        }

        // Update task status count if status is changing to completed
        if (updateData.status === 'Completed' && task.status !== 'Completed') {
            await User.findByIdAndUpdate(task.creator, {
                $inc: { completedTasks: 1 }
            });
        }

        Object.assign(task, updateData);
        await task.save();

        return task;
    }

    async deleteTask(taskId, userId, userRole) {
        const task = await Task.findById(taskId);
        if (!task) throw new Error('Task not found');

        // Check authorization
        if (userRole !== 'admin' && task.creator.toString() !== userId) {
            throw new Error('Not authorized to delete this task');
        }

        // Delete task image if exists
        if (task.imageUrl) {
            await cloudinaryService.deleteImage(task.imageUrl);
        }

        await task.remove();

        // Update user's task counts
        const updateData = { $inc: { totalTasks: -1 } };
        if (task.status === 'Completed') {
            updateData.$inc.completedTasks = -1;
        }
        await User.findByIdAndUpdate(task.creator, updateData);

        return { message: 'Task removed successfully' };
    }

    async getLeaderboard() {
        return await User.aggregate([
            {
                $project: {
                    name: 1,
                    completedTasks: 1,
                    totalTasks: 1,
                    completionRate: {
                        $cond: [
                            { $eq: ['$totalTasks', 0] },
                            0,
                            { $divide: ['$completedTasks', '$totalTasks'] }
                        ]
                    }
                }
            },
            { $sort: { completionRate: -1, completedTasks: -1 } }
        ]);
    }

    async getAssignedTasks(userId, query) {
        const {
            status,
            priority,
            page = 1,
            limit = 10
        } = query;

        const filter = { assignedTo: userId };
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const skip = (page - 1) * limit;

        const [tasks, total] = await Promise.all([
            Task.find(filter)
                .sort({ dueDate: 1 })
                .skip(skip)
                .limit(parseInt(limit))
                .populate('creator', 'name'),
            Task.countDocuments(filter)
        ]);

        return {
            tasks,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        };
    }

    async createTaskNotification(taskId, userId, type) {
        const notification = new Notification({
            taskId,
            userId,
            type
        });
        await notification.save();
        return notification;
    }

    async getTaskNotifications(userId) {
        return await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'taskId',
                select: 'title'
            });
    }

    async getUserStats(userId) {
        const user = await User.findById(userId);
        const assignedTasks = await Task.countDocuments({ assignedTo: userId });
        const completedAssigned = await Task.countDocuments({
            assignedTo: userId,
            status: 'Completed'
        });

        return {
            totalCreated: user.totalTasks,
            completedCreated: user.completedTasks,
            totalAssigned: assignedTasks,
            completedAssigned,
            completionRate: user.totalTasks > 0 ? (user.completedTasks / user.totalTasks) * 100 : 0
        };
    }
}

module.exports = new TaskService();
