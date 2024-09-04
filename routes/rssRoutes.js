import express from 'express';
import { addRSSFeed, reloadArticles , getRSSFeed,deleteAllDailyScans, deleteRSSFeed,checkDailyScanStatus} from '../controllers/rssController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/rss',authMiddleware, getRSSFeed);
router.post('/rss/add',authMiddleware,  addRSSFeed);
router.delete('/rss/:id',authMiddleware,  deleteRSSFeed);
router.post('/rss/reload',authMiddleware,  reloadArticles);
router.get('/rss/check-daily-scan',authMiddleware,checkDailyScanStatus);
router.delete('/rss/delete-daily-scan',authMiddleware, deleteAllDailyScans);


export default router;
