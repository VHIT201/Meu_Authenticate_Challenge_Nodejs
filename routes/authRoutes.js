const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken, checkAdminRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Các route đăng ký, đăng nhập, đăng xuất
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Route yêu cầu quyền admin
router.get('/admin', authenticateToken, checkAdminRole, (req, res) => {
  // Trả về thông tin người dùng từ middleware
  res.json({
    message: 'Chào mừng Admin!',
    user: {
      username: req.user.username,
      role: req.user.role
    }
  });
});

module.exports = router;
