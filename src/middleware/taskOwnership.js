// middleware/taskOwnership.js
const Task = require('../models/Task');
exports.checkTaskOwnership = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Admins can always delete
        if (req.user.role === 'admin') {
            return next();
        }

        // Check if user is the task creator
        if (task.creator.toString() === req.user._id.toString()) {
            return next();
        }

        // If neither admin nor creator
        return res.status(403).json({
            success: false,
            message: 'You are not the owner of this task'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying task ownership'
        });
    }
};