const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

// Middleware xác thực token
exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Thiếu tiêu đề xác thực' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findOne({ username: decoded.username, 'tokens.token': token });
    if (!user) {
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }

    req.user = user; // Thêm thông tin người dùng vào request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

// Middleware kiểm tra quyền admin
exports.checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Quyền truy cập bị từ chối. Chỉ có admin mới được phép truy cập.' });
  }
  next();
};
    