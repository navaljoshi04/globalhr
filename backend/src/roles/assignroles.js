
import pool from "../config/db";

class UserAccessStrategy{
    constructor(currentuser){
        this.userId= currentuser.userId,
        this.roleId= currentuser.roleId,
        this.companyId = currentuser.companyId,
        this.permissions = currentuser.permissions || [];
    
    }


    async findUser(targetUserId){
        const query = `
                 select users.*,
                        dep.name as department_name,
                        dep.code,
                        roles.name as role_name,
                        des.title as designation_title,
                        rm.full_name as reporting_manager_name,
                        sm.full_name as super_reporting_manager_name

                from users 
                    left join roles on users.role_id = roles.id,
                    left join departments dep on users.department_id= dep.id,
                    left join designations des on users.designation_id = des.id,
                    left join users rm on users.reporting_manager_id= rm.id
                    left join users sm on users.super_manager_id = sm.id

                where users.id= $1 AND users.company_id= $2
               `;
        const {rows} = await pool.query(query,[targetUserId,this.companyId]);
    }
}