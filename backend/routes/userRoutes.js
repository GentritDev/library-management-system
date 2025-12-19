const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleAdminStatus,
  getMyProfile,
  updateMyProfile
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// All routes require authentication
router. use(authMiddleware);

// User profile routes (any authenticated user) 
router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);

// Admin specific routes (before /:id)
router.put('/:id/toggle-admin', adminMiddleware, toggleAdminStatus);

// Admin user management routes
router.get('/', adminMiddleware, getAllUsers);
router.get('/:id', adminMiddleware, getUserById);
router.put('/:id', adminMiddleware, updateUser);
router.delete('/:id', adminMiddleware, deleteUser);

module.exports = router;