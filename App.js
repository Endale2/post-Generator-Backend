import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import rssRoutes from './routes/rssRoutes.js';
import authRoutes from './routes/authRoutes.js';
import newsRoutes from './routes/newsRoutes.js'
import settingRoutes from './routes/settingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();

// Initialize cookie-parser middleware
app.use(cookieParser());

// Middleware
   // CORS configuration
app.use(cors({
    origin: ["https://lkd-post-generator.vercel.app","https://posts-portal2024.onrender.com", "http://localhost:5173/"], // Allow only your frontend's origin
    credentials: true, // Allow cookies and other credentials
  }));
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api', rssRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/posts', newsRoutes);
app.use('/api/setting', settingRoutes);
app.use('/api/admin', adminRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
