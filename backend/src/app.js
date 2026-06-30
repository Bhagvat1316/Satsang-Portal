const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Satsang Portal Backend Running'
  });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const journalRoutes = require('./routes/journalRoutes');
const bannerRoutes = require('./routes/bannerRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/banners', bannerRoutes);

// Cloudinary Test Route
const { verifyCloudinaryConnection } = require('./config/cloudinary');
app.get('/api/cloudinary-test', async (req, res) => {
  try {
    const isConnected = await verifyCloudinaryConnection();
    if (isConnected) {
      res.status(200).json({
        success: true,
        message: 'Cloudinary Connected'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Cloudinary Connection Failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cloudinary Connection Failed'
    });
  }
});

module.exports = app;
