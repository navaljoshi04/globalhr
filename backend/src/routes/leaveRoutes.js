import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { applyLeave, getLeaves, hrLeaveActions, managerLeaveActions } from "../controllers/leaveController.js";


const router = express.Router();

router.get('/',authenticateToken,getLeaves);
router.post('/',authenticateToken,applyLeave);

router.patch('/manager/update/:id',authenticateToken,managerLeaveActions);
router.patch('/hr/update/:id',authenticateToken,hrLeaveActions);


export default router; 