const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadToMemory, handleMulterError } = require('../middleware/upload');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getLeaderboard,
    getAssignedTasks,
    getTaskNotifications,
    getUserStats
} = require('../controllers/taskController');

router.use(protect); // Protect all routes

// Apply upload handling with error handling middleware
router.post('/', uploadToMemory.single('image'), handleMulterError, createTask);
router.put('/:id', uploadToMemory.single('image'), handleMulterError, updateTask);

router.route('/')
    .get(getTasks);

router.route('/:id')
    .delete(deleteTask);

router.get('/leaderboard', getLeaderboard);
router.get('/assigned', getAssignedTasks);
router.get('/notifications', getTaskNotifications);
router.get('/stats', getUserStats);

module.exports = router;