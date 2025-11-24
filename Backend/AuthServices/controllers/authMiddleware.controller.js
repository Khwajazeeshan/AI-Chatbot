import jwt from "jsonwebtoken";
import SignupModel from "../models/user.model.js";
import { generateTokens } from "../utils/tokens/generateTokens.js";

export async function authMiddleware(req, res, next) {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    // No token at all
    if (!accessToken && !refreshToken) {
        return res.status(401).json({ authenticated: false });
    }

    // -----------------------
    // 1. Try Access Token First
    // -----------------------
    try {
        if (accessToken) {
            const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

            const user = await SignupModel.findById(decoded.id || decoded._id);

            if (user) {
                req.user = user;
                return next();
            }
        }
    } catch (err) {
        // Access token failed → go to refresh
    }

    // -----------------------
    // 2. Try Refresh Token
    // -----------------------
    if (!refreshToken) {
        return res.status(401).json({ authenticated: false });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await SignupModel.findById(decoded.id || decoded._id);

        if (!user) {
            return res.status(401).json({ authenticated: false });
        }

        // Generate new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

        // Set cookies
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        req.user = user;
        return next();

    } catch (err) {
        return res.status(401).json({ authenticated: false });
    }
}
