import pool  from "../config/db";

const getLeavesStrategies= {
    "manage:self:leave":async(req,res,userId)=>{

    },
    "manage:team:leave":async(req,res,userId)=>{
        const permissions= req.user.permissions || [];
        const companyId= res.user.companyId; 

        if(!permissions.includes('manager')){
            return res.status(403).json({ success: false, message: "You are not authorized to view the teams connect with the admin!"});
        }
        const query= `
            select lr.*, 
                   u.full_name as employee_name, 
                   u.employee_code,
                   lt.name as leave_type_name
            from leave_requests lr
            left join users u on lr.user_id = u.id
            left join leave_types lt on lr.leave_type_id = lt.id
            where lr.company_id=$1
                    and(u.reporting_manager_id=$2 or u.super_manager_id=$2)
                    order by lr.created_at desc;
            `;
        const {rows} = await pool.query(query,[companyId,userId]);
        return res.status(200).json({ success: true, data: rows });
    },
    "manage:company:leave":async(res,res,userId,companyId)=>{

    }
}

export const applyLeave= async(req, res)=>{
    try {
        const companyId = req.user.companyId;
        const userId = req.user.userId;
        const {leave_type_id,start_date,end_date,total_days,reason} = req.body;
        if (!leave_type_id || !start_date || !end_date || !total_days || !reason) {
            return res.status(400).json({ success: false, message: "all required fields must be provided!" });
        }
        const query = `insert into 
                                 leave_requests(
                                 company_id,user_id,leave_type_id,start_date,end_date,total_days,reason)
                                 values($1,$2,$3,$4,$5,$6,$7)
                                 returning id, start_date, end_date, total_days, status, created_at;
                        `
        const {rows}= await pool.query(query,[companyId,userId,leave_type_id,start_date,end_date,total_days,reason]);
        return res.status(201).json({
            success: true,
            message: "leave application submitted successfully!",
            data: rows[0]
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

