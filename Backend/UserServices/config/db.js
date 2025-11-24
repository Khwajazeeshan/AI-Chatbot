import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDb = async () => {
    dotenv.config();
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("✅ Mongo DB connected successfully");
    }
    catch (err) {
        console.log("Database connection error", err);
    }
}

export default connectDb;