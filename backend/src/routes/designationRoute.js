import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { createDepartments, getDepartments } from "../controllers/departmentController";


const router= express.Router();



router.post('/create',authenticateToken,createDepartments);
router.get('/get/all',authenticateToken,getDepartments);

export default router; 
