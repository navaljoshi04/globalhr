import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { createDepartments, getDepartments } from "../controllers/departmentController.js";

const router = express.Router();

router.get('/all',authenticateToken,getDepartments);
router.post('/create',authenticateToken,createDepartments);
