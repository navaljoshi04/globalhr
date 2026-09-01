
import express from "express";
import helmet from "helmet";
import cors from "cors"; 
import morgan from "morgan";
import cookieParser from "cookie-parser"; 

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "HRMS API is running"
    });
});

export default app; 