import Signup from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { generateTokens } from "../utils/tokens/generateTokens.js";
import { SendLoginEmail } from "../services/loginEmail.service.js";

dotenv.config();

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Signup.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User Doesn't Exist..." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Incorrect Password" });
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        // Send login email (optional)
        SendLoginEmail(req, user).catch(err => console.error("Login email error:", err));

        // Set cookies (httpOnly, secure)
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            domain: "localhost",
            maxAge: 60 * 60 * 1000
        });
        

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            domain: "localhost",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        // Return minimal info (tokens in cookies)
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                verificationStatus: user.isVerified
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};
