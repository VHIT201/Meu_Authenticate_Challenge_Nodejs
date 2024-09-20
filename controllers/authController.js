const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

// Đăng ký người dùng với role mặc định là 'user'
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Người dùng đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role: role || 'user' }); // Thiết lập role
    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công', role: newUser.role, success : true, username : req.username });
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký người dùng', error });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Người dùng không tồn tại' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác' });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' }); // Bao gồm role trong token
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.json({ token, message: 'Đăng nhập thành công', role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập', error });
  }
};

exports.logout = async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  try {
    if (!token) {
      return res.status(401).json({ message: 'Thiếu token' });
    }

    const user = await User.findOne({ 'tokens.token': token });
    if (!user) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    user.tokens = user.tokens.filter(t => t.token !== token);
    await user.save();

    res.json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng xuất', error });
  }
};
