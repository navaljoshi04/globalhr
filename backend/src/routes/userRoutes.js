import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware";


import { getMyProfile, getTeamMemberProfile,getTeamMembersList,getAllCompanyEmployeeAsHr, createUser, updateUser, deactivateUser } from "../controllers/userController";


const router= express.Router();

// Read Routes
router.get('/me', authenticateToken, getMyProfile);
router.get('/team', authenticateToken,getTeamMembersList);
router.get('/team/:id', authenticateToken,getTeamMemberProfile);
router.get('/manage/employees',authenticateToken,getAllCompanyEmployeeAsHr);


// Write / Mutation Routes (HR / Admin)
router.post('/create/employee',authenticateToken,createUser);
router.patch('/update/employee/:id',authenticateToken,updateUser);


// delete Routes (HR / Admin)
router.delete('/delete/employee/:id',authenticateToken,deactivateUser);
export default router; 