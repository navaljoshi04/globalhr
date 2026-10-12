import pool  from "../config/db.js";

const getLeavesStrategies= {
    "manage:self:leave":async(req,res)=>{
        const companyId= req.user.companyId;
        const userId= req.user.userId; 
        const query=`select lr.*,
                            u.full_name as employee_name,
                            u.employee_code,
                            lt.name as leave_type_name
                        from leave_requests lr
                        left join users u on lr.user_id = u.id
                        left join leave_types lt on lr.leave_type_id=lt.id
                        where lr.company_id=$1 
                              and lr.user_id=$2
                        order by lr.created_at desc;
                        ;
                        `
        const {rows} = await pool.query(query,[companyId,userId]);
        return res.status(200).json({
            success:true,
            data:rows
        });
    },
    "manage:team:leave":async(req,res)=>{
        const permissions= req.user.permissions || [];
        const companyId= req.user.companyId; 
        const userId= req.user.userId; 

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
    "manage:company:leave":async(req,res)=>{
        const permissions= req.user.permissions || [];
        const companyId= req.user.companyId; 

         if(!permissions.includes('hr')){
            return res.status(403).json({ success: false, message: "You are not authorized to view the member of this company, connect with the admin!"});
        };
        const query= `select 
                               lr.*,
                               u.full_name as employee_name,
                               u.employee_code,
                               lt.name as leave_type_name
                            from leave_requests lr
                            left join users u on lr.user_id = u.id
                            left join leave_types lt on lr.leave_type_id=lt.id
                            where lr.company_id=$1
                            order by lr.created_at desc;
                            `;
        const {rows} = await pool.query(query,[companyId]);
        return res.status(200).json({ success: true, data: rows });
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
        const checkBalanceQuery= `select total_allocated, 
                                    used_leaves,
                                    pending_leaves
                                from leave_balances 
                                where user_id=$1
                                      and company_id=$2
                                      and leave_type_id=$3
                                      and year=$4 ;
                                `
        const balanceResult = await pool.query(checkBalanceQuery, [userId, companyId, leave_type_id, currentYear]);
        if(balanceResult.rows.length === 0){
            return res.status(400).json({ 
                success: false, 
                message: "Leave balance record not found for this leave type. Please contact HR." 
            });
        };
        const balance = balanceResult.rows[0];
        const availableBalance = Number(balance.total_allocated) - (Number(balance.used_leaves) + Number(balance.pending_leaves));
        if (total_days > availableBalance) {
            return res.status(400).json({ 
                success: false, 
                message: `Insufficient leave balance! You requested ${total_days} days, but only ${availableBalance} days are available.` 
            });
        }
        const query = `insert into 
                                 leave_requests(
                                 company_id,user_id,leave_type_id,start_date,end_date,total_days,reason)
                                 values($1,$2,$3,$4,$5,$6,$7)
                                 returning id, start_date, end_date, total_days, status, created_at;
                        `
        const {rows}= await pool.query(query,[companyId,userId,leave_type_id,start_date,end_date,total_days,reason]);
        const updateBalanceQuery = `
            update leave_balances
            set pending_leaves = pending_leaves + $1,
                updated_at = now()
            where user_id = $2 and leave_type_id = $3 and year = $4;
        `;
        await pool.query(updateBalanceQuery, [total_days, userId, leave_type_id, currentYear]);
        return res.status(201).json({
            success: true,
            message: "leave application submitted successfully!",
            data: rows[0]
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getLeaves= async(req,res)=>{
    try {
        const permissions= req.user.permissions || [];
        const userId= req.user.userId; 
        let strategykey= req.query.type || 'manage:self:leave';
        if(!req.query.type){
            if(permissions.includes('hr')){
                strategykey='manage:company:leave';
            }else if(permissions.includes('manager')){
                strategykey= 'manage:team:leave';
            }
        }

        const selectedStrategy= getLeavesStrategies[strategykey];
        if (!selectedStrategy) {
            return res.status(400).json({ success: false, message: "Invalid leave strategy type!" });
        }
        return selectedStrategy(req,res);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const managerLeaveActions= async(req,res)=>{
    try {
        const userId= req.user.userId;
        const companyId= req.usr.companyId;
        const permissions= req.user.permissions || [];
        const leaveId= req.params.id;
        const {comments, action} =req.body;
        
        if (!permissions.includes('manager')) {
            return res.status(403).json({ success: false, message: "Unauthorized: Manager access required." });
        }
        if (!['approved', 'rejected'].includes(action)) {
            return res.status(400).json({ success: false, message: "Invalid action! Use 'approved' or 'rejected'." });
        }

        const checkquery=`
                         select lr.*,
                                u.reporting_manager_id,
                                u.super_manager_id,
                            from leave_requests lr
                            join users u on lr.user_id = u.id
                            where lr.id = $1 and lr.company_id= $2 
                            ;`
        const {rows} = await pool.query(checkquery,[leaveId,companyId]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Leave request not found!" });
        };
        const leave = rows[0];
        if(leave.reporting_manager_id !== userId && leave.super_manager_id !== userId){
            return res.status(403).json({ success: false, message: "You are not authorized to take action on this leave request." });
        }
        const newOverallStatus = action === 'approved' ? 'manager_approved' : 'rejected';
        const updateQuery= `update leave_requests 
                                   set manager_status=$1,
                                       manager_id=$2,
                                       manager_comments=$3,
                                       manager_action_at= now(),
                                       status=$4,
                                       updated_at= now()
                                    where id= $5 
                                    returning *
                                    ;
                                    `
        const updateValues= [action,userId,comments,newOverallStatus,leaveId];
        const updatedResult = await pool.query(updateQuery, updateValues);
        return res.status(200).json({
            success: true,
            message: `Leave request ${action} by manager successfully!`,
            data: updatedResult.rows[0]
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const hrLeaveActions= async(req,res)=>{
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const userId = req.user.userId;
        const permissions = req.user.permissions || [];
        const companyId = req.user.companyId; 
        const leaveId= req.params.id; 

        const {action, comments} = req.body; 
        if (!['approved', 'rejected'].includes(action)) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: "Invalid action! Use 'approved' or 'rejected'." });
        }
         if (!permissions.includes('hr')) {
             await client.query('ROLLBACK');
            return res.status(403).json({ success: false, message: "Unauthorized: Hr  access required." });
        };
        const checkquery= `select lr.*,
                                  u.company_id,
                                  u.role_id
                                from leave_requests lr 
                                left join users u on lr.user_id = u.id 
                                where lr.id= $1 and lr.company_id=$2 
                                ;`;
        const {rows} = await pool.query(checkquery,[leaveId,companyId]);
        if(rows.length == 0){
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: "Leave request not found!" });
        }
        const leave = rows[0];
        if (leave.manager_status !== 'approved') {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: "Manager approval is required first!" });
        }
        const updateQuery= `
                           update leave_requests 
                                  set hr_status=$1,
                                      hr_id=$2,
                                      hr_action_at= now(),
                                      hr_comments=$3,
                                      status=$4
                                  where id=$5
                                  returning *;
                                `
        const values= [action,userId,comments,action,leaveId];
        const updatedResult = await pool.query(updateQuery,values);
        if (action === 'approved') {
            const updateBalanceQuery = `
                update leave_balances
                set pending_leaves = pending_leaves - $1,
                    used_leaves = used_leaves + $1,
                    updated_at = now()
                where user_id = $2 and leave_type_id = $3 and year = $4;
            `;
            await client.query(updateBalanceQuery, [totalDays, leave.user_id, leave.leave_type_id, currentYear]);
        } else if (action === 'rejected') {
            const updateBalanceQuery = `
                update leave_balances
                set pending_leaves = pending_leaves - $1,
                    updated_at = now()
                where user_id = $2 and leave_type_id = $3 and year = $4;
            `;
            await client.query(updateBalanceQuery, [totalDays, leave.user_id, leave.leave_type_id, currentYear]);
        }

        await client.query('COMMIT');
        return res.status(200).json({
            success: true,
            message: `Leave request ${action} by HR successfully!`,
            data: updatedResult.rows[0]
        }); 
    } catch (error) {
        await client.query('ROLLBACK');
       return res.status(500).json({ success: false, message: error.message }); 
    }finally{
        await client.query('RELEASE');
    }
}