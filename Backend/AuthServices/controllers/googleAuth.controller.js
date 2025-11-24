import SignupModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { generateTokens } from "../utils/tokens/generateTokens.js";
import { SendLoginEmail } from "../services/loginEmail.service.js";
import { SendSignupEmail } from "../services/signupEmail.service.js";


dotenv.config();
const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    SERVER,
    CLIENT_URL,
} = process.env;


// Redirect handler to Google's OAuth consent screen
export const googleRedirect = (req, res) => {
    const redirectUri = `${SERVER}/api/google/callback`;
    const scope = encodeURIComponent("openid profile email");
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&access_type=offline&prompt=select_account`;
    return res.redirect(url);
};

// Callback handler to exchange code, get profile, create/find user, and postMessage back to opener
export const googleCallback = async (req, res) => {
    try {
        const code = req.query.code;
        if (!code) {
            return res.status(400).send("Missing code");
        }

        const redirectUri = `${SERVER}/api/google/callback`;

        // Exchange code for tokens
        const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: redirectUri,
                grant_type: "authorization_code"
            })
        });

        if (!tokenResp.ok) {
            const text = await tokenResp.text();
            console.error("Token exchange failed:", text);
            return res.status(500).send("Google token exchange failed");
        }

        const tokenData = await tokenResp.json();
        const access_token = tokenData.access_token;

        // Fetch user info
        const profileResp = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        if (!profileResp.ok) {
            const text = await profileResp.text();
            console.error("Profile fetch failed:", text);
            return res.status(500).send("Failed to fetch Google profile");
        }

        const profile = await profileResp.json();
        const email = (profile.email || "").toLowerCase();
        const name = profile.name || profile.given_name || "Google User";
        const googleId = profile.id;

        // Find existing user
        let user = await SignupModel.findOne({ email });

        let message;

        if (user) {
            try {
                const { accessToken, refreshToken } = generateTokens(user._id);

                // Send login email (async)
                SendLoginEmail(req, user).catch(err => console.error("Login email error:", err));

                // Set cookies
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


                const payload = { success: true, message: "Login successful" };

                return res.send(`
            <script>
            (function() {
                try {
                    window.opener.postMessage(${JSON.stringify(payload)}, "${CLIENT_URL}");
                } catch(e) {
                    console.error(e);
                }
                window.close();
            })();
            </script>
        `);

            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Server Error",
                    error: error.message
                });
            }

        } else {
            // Create new user
            const hashedPassword = await bcrypt.hash(googleId + Date.now().toString(), 10);
            const newUser = new SignupModel({
                name,
                email,
                number: 0,
                password: hashedPassword
            });

            user = await newUser.save();
            const { accessToken, refreshToken } = generateTokens(user._id);

            // Send signup email async
            SendSignupEmail(req, user).catch(err => console.error("Signup email error:", err));

            // Set cookies
            // Set cookies
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 1000 // 1 hour
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            message = "Account created successfully";

            const payload = { success: true, message };

            return res.send(`
        <script>
        (function() {
            try {
                window.opener.postMessage(${JSON.stringify(payload)}, "${CLIENT_URL}");
            } catch(e) {
                console.error(e);
            }
            window.close();
        })();
        </script>
    `);
        }


    } catch (err) {
        console.error("Google callback error:", err);
        return res.status(500).send("Internal server error");
    }
};
