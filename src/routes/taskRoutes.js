const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getLeaderboard
} = require('../controllers/taskController');

router.use(protect); // Protect all routes

router.route('/')
    .post(upload.single('image'), createTask)
    .get(getTasks);

router.route('/:id')
    .put(upload.single('image'), updateTask)
    .delete(deleteTask);

router.get('/leaderboard', getLeaderboard);

module.exports = router;
