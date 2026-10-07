
import pool from "../config/db";

export const getDesignations= async(req,res)=>{
    try {
        const companyId= await req.user.companyId;
        const query= `select 
                         title,
                         created_at,
                         id
                      where company_id=$1
                      ;`
        const {rows} = await pool.query(query,[companyId]);
         return res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
          return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createDesignations= async(req, res)=>{
 try {
    const permissions = req.user.permissions || [];
      if (!permissions.includes('employee:manage:all') && !permissions.includes('hr')) {
            return res.status(403).json({
                success: false,
                message: "forbidden: only hr or admin can create departments."
            });
        };
    const {title} = req.body;
    const companyId= req.user.companyId;
    const query= `
           insert into designations(title,company_id)
           values(
                  $1,$2)
            returning *;
            `;
    const {rows} = await pool.query(query,[title,companyId])        
     return res.status(201).json({
            success: true,
            message: "department successfully created!",
            data: rows[0]
        });    
 } catch (error) {
      return res.status(500).json({
            success: false,
            message: error.message
        });
 }
};