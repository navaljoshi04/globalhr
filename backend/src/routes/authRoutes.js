
import express from "express";
import { getMe, login, logout } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post('/login',login);
router.post('/logout',logout);
router.post('/me', authenticateToken, getMe);


export default router; 