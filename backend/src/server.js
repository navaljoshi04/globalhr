import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("Database connected");
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();