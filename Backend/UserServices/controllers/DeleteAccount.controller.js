import SignupModel from "../models/user.model.js";
import { SendDeleteAccountEmail } from "../services/DeleteAccountEmail.service.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const DeleteAccount = async (req, res) => {
    try {

        const userId = req.user.id || req.user._id;

        // Delete user's chat history from Chat Service
        try {
            const chatServer = process.env.CHAT_SERVER_URL || "http://localhost:7001";
            // We need to pass the user's token to authenticate the request to the chat service
            // Or we can have an internal admin route. 
            // Since we have the token in the request cookies, we can forward it.
            const cookieHeader = req.headers.cookie;

            await axios.delete(`${chatServer}/api/history`, {
                headers: {
                    Cookie: cookieHeader
                },
                withCredentials: true
            });
            console.log("Chat history deleted for user:", userId);
        } catch (chatError) {
            console.error("Failed to delete chat history:", chatError.message);
            // Proceed with account deletion even if chat deletion fails? 
            // Usually yes, but logging it is important.
        }

        const deletedUser = await SignupModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken"); // Also clear refresh token
        await SendDeleteAccountEmail(req, deletedUser).catch(err => console.error("DeleteAccount email error:", err));

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("DeleteAccount Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};
