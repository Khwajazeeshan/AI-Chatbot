import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";



dotenv.config();
const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS Configuration
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
    cors({
        origin: CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Preflight OPTIONS support
app.options("*", cors({ origin: CLIENT_URL, credentials: true }));

// Routes
app.use("/api", authRoutes);

export default app;
