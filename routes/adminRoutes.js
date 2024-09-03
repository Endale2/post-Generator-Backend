// src/routes/adminRoutes.js

import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/adminController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {isAdmin} from '../middleware/adminMiddleware.js'

const router = express.Router();


router.get('/users',authMiddleware, isAdmin, getAllUsers);
router.delete('/user/:id', authMiddleware,isAdmin, deleteUser);


export default router;
