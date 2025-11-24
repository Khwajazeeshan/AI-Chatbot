import SignupModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { SendSignupEmail } from "../services/signupEmail.service.js";
import { generateTokens } from "../utils/tokens/generateTokens.js";
import SendMail from "../middleware/email/SendMail.js";

dotenv.config();

// In-memory OTP store for signup flow: { [email]: { otp, expires, tempUser } }
const otpStore = {};

export const SignupCheck = async (req, res) => {
    try {
        const { name, email, number, password, confirmPassword } = req.body || {};

        // Normalize email
        const normalizedEmail = email.toLowerCase();

        const existingUser = await SignupModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists with this email" });
        }

        // Hash password before storing temporarily
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store temp user data + otp, expire in 10 minutes
        otpStore[normalizedEmail] = {
            otp,
            expires: Date.now() + 10 * 60 * 1000, // 10 minutes
            tempUser: {
                name,
                email: normalizedEmail,
                number,
                password: hashedPassword
            }
        };

        // Send OTP email
        await SendMail(
            normalizedEmail,
            "Account Verification OTP",
            `
            <p>Hello ${name},</p>
            <p>Use the following OTP to verify your account:</p>
            <h1>${otp}</h1>
            <p>This OTP is valid for 10 minutes.</p>`
        );

        return res.status(201).json({ success: true, message: "Account Verification OTP sent to your email." });
    } catch (err) {
        console.error("SignupCheck error:", err);
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

export const verifySignup = async (req, res) => {
    try {
        const { email, otp } = req.body || {};
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const normalizedEmail = email.toLowerCase();
        const record = otpStore[normalizedEmail];

        if (!record) {
            return res.status(400).json({ success: false, message: "No pending signup for this email or OTP expired" });
        }

        if (Date.now() > record.expires) {
            delete otpStore[normalizedEmail];
            return res.status(400).json({ success: false, message: "OTP expired. Please signup again." });
        }

        if (record.otp !== otp.toString()) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // Create user using tempUser data
        const { name, number } = record.tempUser;
        const user = new SignupModel({
            name,
            email: normalizedEmail,
            number,
            password: record.tempUser.password // already hashed
        });

        const savedUser = await user.save();

        // Generate tokens and set cookies
        const { accessToken, refreshToken } = generateTokens(savedUser._id);
    
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


        // Optionally send signup email in background
        SendSignupEmail(req, savedUser).catch(err => console.error("SendSignupEmail error:", err));

        // Clear temp record
        delete otpStore[normalizedEmail];

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });
    } catch (err) {
        console.error("verifySignup error:", err);
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};
