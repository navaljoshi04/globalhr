import pool from "../config/db";

export const getDepartments= async(req, res)=>{
    try {
        const companyId= req.user.companyId;
        const query= `
                     select 
                           id, 
                           name, 
                           code, 
                           created_at 
                     from departments
                     where company_id=$1
                     order by name asc;
                    `;
        const {rows}= await pool.query(query,[companyId]);
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

export const createDepartments = async(req, res)=>{
    try {
        const permissions = req.user.permissions || [];
        if (!permissions.includes('employee:manage:all') && !permissions.includes('hr')) {
            return res.status(403).json({
                success: false,
                message: "forbidden: only hr or admin can create departments."
            });
        };
        const {name, code} = req.body; 
        const companyId = req.user.companyId;
        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "department name and code is required!"
            });
        }
        const query = `
            insert into departments (company_id, name, code)
            values ($1, $2, $3)
            returning id, name, code, created_at;
        `;
        const { rows } = await pool.query(query, [companyId, name, code]);
        return res.status(201).json({
            success: true,
            message: "department successfully created!",
            data: rows[0]
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                message: "department with this name already exists in your company!"
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}