// routes/newsRoutes.js
import express from 'express';
import {getAllPosts} from '../controllers/newsController.js'; // Adjust the import path as needed
import {authMiddleware} from '../middleware/authMiddleware.js';
const router = express.Router();

// Routes for TodaysPost
router.get('/',authMiddleware, getAllPosts);


export default router;
