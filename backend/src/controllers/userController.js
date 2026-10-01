
import UserAccessStrategy from "../roles/assignroles";


export const getMyProfile = async (req, res)=>{
    try {
        const strategy = new UserAccessStrategy(req.user);
        const userData = await strategy.handleSelfProfile(req.user.userId);
        return res.status(200).json({
            success:true,
            data:userData,
        })
    } catch (error) {
        return res.status(403).json({ 
            success: false, 
            message: error.message 
        });
    }
}

export const getTeamMemberProfile = async(req, res)=>{
    try {
        const strategy = await UserAccessStrategy(req.user);
        const targetUserId = req.params.id; 
        const userData= await strategy.handleTeamProfile(targetUserId);
        return res.status(200).json({
            success: true,
            data: userData
        });
    } catch (error) {
        return res.status(403).json({ 
            success: false, 
            message: error.message 
        });
    }
}

export const getTeamMembersList= async(req, res)=>{
    try {
        const strategy = await UserAccessStrategy(req.user);
        if(!strategy.permissions.includes("manager")){
            return res.status(403).json({
                success:false,
                message:'Forbidden, Manager access is required !'
            })
        };
        const teamList= await strategy.handleTeamList();
        return res.status(200).json({
            success: true,
            data: teamList
        });
    } catch (error) {
        return res.status(403).json({
            success: false,
            message:error.message
        });
    }
}

export const getAllCompanyEmployeeAsHr= async(req, res)=>{
    try {
        const strategy = await UserAccessStrategy(req.user);
        if (!strategy.permissions.includes('employee:manage:all') && !strategy.permissions.includes('hr')) {
            return res.status(403).json({ success: false, message: "Forbidden: HR access required" });
        }
        const employeeList= await strategy.handleHrCompanyEmployeeList();
        return res.status(200).json({
            success: true,
            data:employeeList
        });
    } catch (error) {
        return res.status(403).json({
            success:false,
            message:error.message
        });
    }
}