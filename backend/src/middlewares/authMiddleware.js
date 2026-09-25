
import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res ,next )=>{
    const token = await req?.cookies?.token || req.headers.authorization.split([' '])[1];
    if(!token) return res.status(401).json({
        success:false,
        message:"Access Denied. No token provided !"
    });
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({success: false, message:"Invalid or expired token !"});
    }
}