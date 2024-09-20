const mongoose = require('mongoose');

// Đọc biến môi trường từ .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth-demo';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Kết nối MongoDB thành công');
  } catch (err) {
    console.error('Lỗi kết nối MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
