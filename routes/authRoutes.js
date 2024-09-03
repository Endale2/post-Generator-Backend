import express from 'express';
import {  login, register, getUser, logout } from '../controllers/authController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import 'dotenv/config';
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
//router.post('/refresh-token', authMiddleware,refreshToken);
router.post('/logout', authMiddleware,logout);
router.get('/user',authMiddleware, getUser);

export default router;
