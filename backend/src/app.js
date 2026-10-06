import express from "express";
import helmet from "helmet";
import cors from "cors"; 
import morgan from "morgan";
import cookieParser from "cookie-parser"; 
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import departmentRoutes from "./routes/departmentRoute.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// api routes versioning
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes); 
app.use('/api/v1/departments', departmentRoutes); 

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "HRMS API is running"
    });
});

export default app;