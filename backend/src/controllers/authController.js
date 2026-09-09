import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({
        success:false,
        message:"Full credentails are required !"
    });
    try {
       const userResult = await pool.query(
        `SELECT  id,
                 company_id,
                 role_id,
                 full_name,
                 password_hash,
                 email 
                FROM users 
                WHERE email=$1 
                AND is_active=true;
                `,[email]
       );
       if(userResult.length === 0) return res.status(401).json({success:false,message:"Invalid credentials "});
       const user= userResult.rows[0];
       const isMatch= await bcrypt.compare(password, user.password_hash);
       if(!isMatch){
         return res.status(401).json({
            success:false,
            message:"Invalid credentials "
         });
       }
       const token = jwt.sign({userId:user.id, companyId:user.company_id, roleId:user.role_id},process.env.JWT_SECRET,{expiresIn:'1d'});
       res.cookie('token',token,{
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000, 
       });
       return res.status(200).json({
          success: true,
          message:"Successfully logged in !",
          user:{
            id:user.id,
            name:user.full_name,
            email:user.email
          }
       });
    } catch (error) {
        console.log("error whiel logged in :",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error "
        });
    }
};


export const logout= async (req, res)=>{
    res.clearCookie('token');
    return res.status(200).json({
        success:true,
        message:"Successfully logged out!"
    })
};


export const getMe = async (req, res)=>{
    try {
        const userResult = await pool.query(
             `SELECT 
                     id,
                     company_id,
                     role_id,
                     full_name,
                     employee_code,
                     email,
                     profile_image
                    FROM  
                    users 
                    WHERE id=$1
                    ;`,[req.user.userId]
        );
        if(userResult.rows.length === 0) return res.status(404).json({
            success:false,
            message:"User not found !"
        });

        return res.status(200).json({
            success: true,
            message:"Successfully fetched the user !",
            user:userResult.rows[0]
        })
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}