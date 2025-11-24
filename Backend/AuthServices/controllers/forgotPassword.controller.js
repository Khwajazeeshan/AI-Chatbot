import Signup from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import SendMail from "../middleware/email/SendMail.js";
import { SendForgetEmail } from "../services/forgotEmail.service.js";


dotenv.config();
const Secret_key = process.env.JWT_SECRET;

// In-memory OTP storage (or use DB)
const otpStore = {}; // { email: { otp: '12345', expires: Date } }

// STEP 1 → Request OTP
export const requestOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Signup.findOne({ email });
        if (!user)
            return res.status(400).json({ success: false, message: "User Doesn't Exist..." });

        // Generate 5-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP temporarily, expires in 10 min
        otpStore[email] = {
            otp,
            expires: Date.now() + 5 * 60 * 1000
        };

        // Send OTP to email
        await SendMail(
            email,
            "Password Reset OTP",
            `<h2>Password Reset OTP</h2>
            <p>Hello ${user.name}, use the following OTP to reset your password:</p>
            <h1>${otp}</h1>
            <p>This OTP is valid for 10 minutes.</p>`
        );

        res.status(201).json({ success: true, message: "OTP sent to your email." });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

// STEP 2 → Verify OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const record = otpStore[email];

        if (!record) return res.status(400).json({ success: false, message: "OTP not found, request again" });
        if (Date.now() > record.expires) return res.status(400).json({ success: false, message: "OTP expired" });
        if (otp !== record.otp) return res.status(400).json({ success: false, message: "Incorrect OTP" });
        res.status(200).json({ success: true, message: "OTP verified" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

// STEP 3 → Reset password
export const resetPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const user = await Signup.findOne({ email });

        if (!user) return res.status(400).json({ success: false, message: "User Doesn't Exist..." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        await user.save();

        // Remove OTP from store
        delete otpStore[email];
        SendForgetEmail(req, user).catch(err => console.error("Forget Password email error:", err));

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};
