import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware";


import { getMyProfile, getTeamMemberProfile,getTeamMembersList,getAllCompanyEmployeeAsHr } from "../controllers/userController";


const router= express.Router();
router.get('/me', authenticateToken, getMyProfile);
router.get('/team', authenticateToken,getTeamMembersList);
router.get('/team/:id', authenticateToken,getTeamMemberProfile);
router.get('/manage/employees',authenticateToken,getAllCompanyEmployeeAsHr);



export default router; 