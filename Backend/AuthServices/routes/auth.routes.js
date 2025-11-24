import express from "express";
import { login } from "../controllers/login.controller.js";
import { SignupCheck, verifySignup } from "../controllers/signup.controller.js";
import { requestOTP, verifyOTP, resetPassword } from "../controllers/forgotPassword.controller.js";
import { googleRedirect, googleCallback } from "../controllers/googleAuth.controller.js";
import { authMiddleware } from "../controllers/authMiddleware.controller.js";
import { logout } from "../controllers/logout.controller.js";

const router = express.Router();


// ----------- EMAIL/PASSWORD ROUTES -----------
router.post("/login", login);
router.post("/signup", SignupCheck);
router.post("/signup/verify", verifySignup);
router.put("/forget", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

// ----------- GOOGLE ROUTES (no passport) -----------
router.get("/google", googleRedirect);
router.get("/google/callback", googleCallback);

// ----------- ME ROUTE -----------
router.get("/me", authMiddleware, (req, res) => {
    res.status(200).json({ authenticated: true, user: req.user });
});


export default router;
