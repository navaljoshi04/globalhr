
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
        if(rows.length == 0){
            throw new Error("user not found or access denied for this tenant!")
        }
        return rows[0];
    }

    async handleSelfProfile(targetUserId){
        if(targetUserId != this.userId){
            throw new Error("unauthorized, you can access only your profile");
        }
        return this.findUser(targetUserId);
    }

    async handleTeamProfile(targetUserId){
        if(targetUserId == this.userId){
            return await this.findUser(this.userId);
        };

        const query= `
                     select 1 from users
                     where id=$1 and company_id=$2
                     and (reporting_manager_id=$3 or super_manager_id=$3) 
                     `;
        const {rows}= await pool.query(query,[targetUserId,this.companyId, this.userId]);
        if(rows.length == 0){
            throw new Error("unauthorized, target employee does not reports to you !")
        };

        return await this.findUser(targetUserId);
    }

    async handleTeamList(){
        const query=`
                    select users.id,
                           user.full_name,
                           user.employee_code,
                           user.email,
                           user.phone_number,
                           user.profile_image_url
                           user.is_active
                           dep.name as department_name,
                           roles.name as role_name,
                           des.title as designation_title
                        from users 
                        left join roles on users.role_id = roles.id
                        left join departments dep on user.department_id= dep.id
                        left join designations des on user.designation_id= des.id

                        where users.company_id = $1,
                        and (users.reporting_manager_id = $2 or user.super_manager_id=$2
                        )
                        `;
        const {rows} = await pool.query(query, [this.companyId,this.userId]);
        return rows; 
    };

    async handleHrManagement(targetUserId){
        return await this.findUser(targetUserId);
    };

    async handleHrCompanyEmployeeList(){
        const query= `
                select 
                   users.id, users.full_name, users.email, users.employee_code, 
                   users.phone_number, users.is_active,
                   dep.name as department_name,
                   roles.name as role_name,
                   des.title as designation_title,
                   rm.full_name as reporting_manager_name
                from users 
                    left join roles on users.role_id = roles.id
                    left join departments dep on user.department_id = dep.id
                    left join designations des on user.designation_id = des.id
                    
                where user.company_id= $1
                `;
        const {rows}= await pool.query(query,[this.companyId]);
        return rows; 
    }
    async executeQuery(targetUserId, actionType){
        if(this.permissions.includes('employee:manage:all')|| this.permissions.includes('hr')){
            return await this.handleHrManagement(targetUserId);
        }
        if(actionType === 'self'|| this.permissions.includes('user')){
            return await this.handleSelfProfile(targetUserId);
        }
        if(actionType === 'manager'|| this.permissions.includes('manager')){
            return await this.handleTeamProfile(targetUserId);
        }
        throw new Error('Forbidden: Insufficient previlages for this action !')
    }
}
export default UserAccessStrategy; 