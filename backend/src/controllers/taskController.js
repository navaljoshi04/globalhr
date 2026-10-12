import pool from "../config/db.js";

export const createTask = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const assignedBy = req.user.userId;
    const {
      assigned_to,
      department_id,
      title,
      description,
      status,
      priority,
      due_date,
    } = req.body;
    if (
      !assigned_to ||
      !title ||
      !description ||
      !priority ||
      !due_date ||
      !department_id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields (assigned_to, title, description, priority, department_id, due_date) must be provided!",
      });
    }
    const taskQuery = `insert into tasks(
                                         company_id,
                                         assigned_to,
                                         assigned_by,
                                         department_id,
                                         title,
                                         description,
                                         status,
                                         priority,
                                         due_date
                                         )
                                        values(
                                        $1,$2,$3,$4,$5,$6,$7,$8,$9
                                        )
                                        returning *;
                                        `;
    const taskValues = await pool.query(taskQuery, [
      companyId,
      assigned_to,
      assignedBy,
      department_id,
      title,
      description,
      status || "pending",
      priority,
      due_date,
    ]);
    if (taskValues.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "failed to create the task, please try again later!",
      });
    }
    return res.status(201).json({
      success: true,
      message: "successfully created the tasks!",
      data: taskValues.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error! please try again later!",
    });
  }
};


export const updateTaskStatus = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.company_id; 
    const userId = req.user.userId;
    const taskId = req.params.id;
    const { status, description, priority } = req.body;
    const checkquery = `
      select * from tasks 
      where id = $1 and company_id = $2;
    `;
    const { rows } = await pool.query(checkquery, [taskId, companyId]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized!",
      });
    }

    const task = rows[0];

    const updateQuery = `
      update tasks 
      set status = coalesce($1, status),
          priority = coalesce($2, priority),
          description = coalesce($3, description),
          updated_at = now()
      where id = $4 and company_id = $5
      returning *;
    `;

    const updatedResult = await pool.query(updateQuery, [
      status || null,
      priority || null,
      description || null,
      taskId,
      companyId,
    ]);

    return res.status(200).json({
      success: true,
      message: "Successfully updated the task!",
      data: updatedResult.rows[0],
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error!",
    });
  }
};