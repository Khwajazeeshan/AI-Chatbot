import dotenv from "dotenv";
import connectDb from "./config/db.js";
import app from "./app.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect DB + Start Server
(async () => {
    try {
        await connectDb();
        app.listen(PORT, () => {
            console.log(`✅ Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
})();
