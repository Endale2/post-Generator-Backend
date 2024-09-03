import express from 'express';
import { updateSetting , getSetting} from "../controllers/settingController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/update',authMiddleware, updateSetting);
router.get('/',authMiddleware, getSetting );

export default router;