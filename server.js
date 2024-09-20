const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); 

const app = express();
const PORT = process.env.PORT || 3001;

// Kết nối đến MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Sử dụng các route từ authRoutes
app.use('/api/auth', authRoutes);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
