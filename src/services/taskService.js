const Task = require('../models/Task');
const User = require('../models/User');
const cloudinaryService = require('./cloudinaryService');

class TaskService {
    async createTask(taskData, userId, file) {
        let imageUrl;
        if (file) {
            const result = await cloudinaryService.uploadImage(file);
            imageUrl = result.secure_url;
        }

        const task = await Task.create({
            ...taskData,
            creator: userId,
            imageUrl
        });

        await User.findByIdAndUpdate(userId, {
            $inc: { totalTasks: 1 }
        });

        return task;
    }

    async getTasks(queryParams, user) {
        const { 
            status, 
            priority, 
            startDate, 
            endDate, 
            search,
            sortBy,
            sortOrder = 'asc',
            page = 1,
            limit = 10,
            assignedTo,
            createdBy
        } = queryParams;

        const query = {};
        const sort = {};

        // Basic filters
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignedTo) query.assignedTo = assignedTo;
        if (createdBy) query.creator = createdBy;

        // Date range filter
        if (startDate || endDate) {
            query.dueDate = {};
            if (startDate) query.dueDate.$gte = new Date(startDate);
            if (endDate) query.dueDate.$lte = new Date(endDate);
        }

        // Search in title and description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // User-specific filtering
        if (user.role !== 'admin') {
            query.$or = [
                { creator: user._id },
                { assignedTo: user._id }
            ];
        }

        // Sorting
        if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1; // Default sort by creation date
        }

        // Pagination
        const skip = (page - 1) * limit;

        const tasks = await Task.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('creator', 'name')
            .populate('assignedTo', 'name');

        const total = await Task.countDocuments(query);

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
        
        if (!task) {
            throw new Error('Task not found');
        }

        if (userRole !== 'admin' && task.creator.toString() !== userId.toString()) {
            throw new Error('Not authorized');
        }

        let imageUrl = task.imageUrl;
        if (file) {
            if (task.imageUrl) {
                await cloudinaryService.deleteImage(task.imageUrl);
            }
            const result = await cloudinaryService.uploadImage(file);
            imageUrl = result.secure_url;
        }

        // Handle completion status change
        if (updateData.status === 'Completed' && task.status !== 'Completed') {
            await User.findByIdAndUpdate(task.creator, {
                $inc: { completedTasks: 1 }
            });
        } else if (updateData.status !== 'Completed' && task.status === 'Completed') {
            await User.findByIdAndUpdate(task.creator, {
                $inc: { completedTasks: -1 }
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { ...updateData, imageUrl },
            { new: true }
        ).populate('creator assignedTo', 'name');

        return updatedTask;
    }

    async deleteTask(taskId, userId, userRole) {
        const task = await Task.findById(taskId);
        
        if (!task) {
            throw new Error('Task not found');
        }

        if (userRole !== 'admin' && task.creator.toString() !== userId.toString()) {
            throw new Error('Not authorized');
        }

        if (task.imageUrl) {
            await cloudinaryService.deleteImage(task.imageUrl);
        }

        await task.remove();

        await User.findByIdAndUpdate(task.creator, {
            $inc: { 
                totalTasks: -1,
                completedTasks: task.status === 'Completed' ? -1 : 0
            }
        });

        return { message: 'Task removed successfully' };
    }

    async getLeaderboard() {
        const users = await User.find({})
            .select('name completedTasks totalTasks')
            .sort({ completedTasks: -1, totalTasks: 1 });

        return users;
    }
}

module.exports = new TaskService();
