
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
        const targetUserId = 
    } catch (error) {
        
    }
}