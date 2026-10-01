import pool from "../config/db";

class UserAccessStrategy {
    constructor(currentuser) {
        this.userId = currentuser.userId;
        this.roleId = currentuser.roleId;
        this.companyId = currentuser.companyId;
        this.permissions = currentuser.permissions || [];
    }

    async findUser(targetUserId) {
        const query = `
            select users.*,
                   dep.name as department_name,
                   dep.code,
                   roles.name as role_name,
                   des.title as designation_title,
                   rm.full_name as reporting_manager_name,
                   sm.full_name as super_reporting_manager_name
            from users 
            left join roles on users.role_id = roles.id
            left join departments dep on users.department_id = dep.id
            left join designations des on users.designation_id = des.id
            left join users rm on users.reporting_manager_id = rm.id
            left join users sm on users.super_manager_id = sm.id
            where users.id = $1 and users.company_id = $2
        `;
        const { rows } = await pool.query(query, [targetUserId, this.companyId]);
        if (rows.length === 0) {
            throw new Error("user not found or access denied for this tenant!");
        }
        return rows[0];
    }

    async handleSelfProfile(targetUserId) {
        if (targetUserId !== this.userId) {
            throw new Error("unauthorized, you can access only your profile");
        }
        return this.findUser(targetUserId);
    }

    async handleTeamProfile(targetUserId) {
        if (targetUserId === this.userId) {
            return await this.findUser(this.userId);
        }

        const query = `
            select 1 from users
            where id = $1 and company_id = $2
            and (reporting_manager_id = $3 or super_manager_id = $3) 
        `;
        const { rows } = await pool.query(query, [targetUserId, this.companyId, this.userId]);
        if (rows.length === 0) {
            throw new Error("unauthorized, target employee does not report to you!");
        }

        return await this.findUser(targetUserId);
    }

    async handleTeamList() {
        const query = `
            select users.id,
                   users.full_name,
                   users.employee_code,
                   users.email,
                   users.phone_number,
                   users.profile_image_url,
                   users.is_active,
                   dep.name as department_name,
                   roles.name as role_name,
                   des.title as designation_title
            from users 
            left join roles on users.role_id = roles.id
            left join departments dep on users.department_id = dep.id
            left join designations des on users.designation_id = des.id
            where users.company_id = $1 
              and (users.reporting_manager_id = $2 or users.super_manager_id = $2)
        `;
        const { rows } = await pool.query(query, [this.companyId, this.userId]);
        return rows; 
    }

    async handleHrManagement(targetUserId) {
        return await this.findUser(targetUserId);
    }

    async handleHrCompanyEmployeeList() {
        const query = `
            select users.id, 
                   users.full_name, 
                   users.email, 
                   users.employee_code, 
                   users.phone_number, 
                   users.is_active,
                   dep.name as department_name,
                   roles.name as role_name,
                   des.title as designation_title,
                   rm.full_name as reporting_manager_name
            from users 
            left join roles on users.role_id = roles.id
            left join departments dep on users.department_id = dep.id
            left join designations des on users.designation_id = des.id
            left join users rm on users.reporting_manager_id = rm.id
            where users.company_id = $1
        `;
        const { rows } = await pool.query(query, [this.companyId]);
        return rows; 
    }

    async executeQuery(targetUserId, actionType) {
        if (this.permissions.includes('employee:manage:all') || this.permissions.includes('hr')) {
            return await this.handleHrManagement(targetUserId);
        }
        if (actionType === 'self' || this.permissions.includes('user')) {
            return await this.handleSelfProfile(targetUserId);
        }
        if (actionType === 'manager' || this.permissions.includes('manager')) {
            return await this.handleTeamProfile(targetUserId);
        }
        throw new Error('forbidden: insufficient privileges for this action!');
    }

    async createUser(newEmployeeData) {
        if (!this.permissions.includes('employee:manage:all') && !this.permissions.includes('hr')) {
            throw new Error("forbidden: only hr or admin can create new employees.");
        }
        const {
            role_id,
            full_name,
            employee_code,
            email,
            password_hash,
            phone_number,
            date_of_birth,
            gender,
            is_active = true,
            department_id,
            designation_id,
            reporting_manager_id,
            super_manager_id
        } = newEmployeeData;

        const query= `
                    insert into users(
                                     company_id,
                                     role_id,
                                     full_name,
                                     employee_code,
                                     email,
                                     password_hash,
                                     phone_number,
                                     date_of_birth,
                                     gender,
                                     is_active,
                                     department_id,
                                     designation_id,
                                     reporting_manager_id,
                                     super_manager_id
                                     )
                                values(
                                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
                                )
                                returning id, full_name, email, employee_code, is_active;
                            `;
        const values= [
            this.companyId, 
            role_id,
            full_name,
            employee_code,
            email,
            password_hash,
            phone_number,
            date_of_birth,
            gender,
            is_active,
            department_id || null,
            designation_id || null,
            reporting_manager_id || null,
            super_manager_id || null
        ];
        const {rows} = await pool.query(query,values);
        return rows[0];

    };

    async updateUser(targetUserId,updaedData){
        if(!this.permissions.includes('employee:manage:all') && !this.permissions.includes('hr')){
            throw new Error('Forbidden:only hr or admin can update new employees');
        };
        const {
            role_id,
            full_name,
            employee_code,
            email,
            password_hash,
            phone_number,
            date_of_birth,
            gender,
            is_active = true,
            department_id,
            designation_id,
            reporting_manager_id,
            super_manager_id
        }= updaedData; 

        const query= `update users 
                      set role_id=$1,
                          full_name=$2,
                          employee_code=$3,
                          email=$4,
                          password_hash=$5,
                          phone_number=$6,
                          date_of_birth=$7,
                          gender=$8,
                          is_active=$9,
                          department_id=$10,
                          designation_id=$11,
                          reporting_manager_id=$12,
                          super_manager_id=$13
                    where id=$14 and company_id=$15
                    returning id, full_name, email, employee_code, is_active;
                    `;
        const values= [
            role_id,
            full_name,
            employee_code,
            email,
            password_hash,
            phone_number,
            date_of_birth,
            gender,
            is_active !== undefined ? is_active : true,
            department_id || null,
            designation_id || null,
            reporting_manager_id || null,
            super_manager_id || null,
            targetUserId,     
            this.companyId
        ];
        const {rows} = await pool.query(query,values);
        if (rows.length === 0) {
            throw new Error("user not found or access denied for this tenant!");
        }
        return rows[0];
    }
}

export default UserAccessStrategy;