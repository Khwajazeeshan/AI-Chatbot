import Chats from "../models/Chats.model.js";

export const getChatHistory = async (req, res) => {
    try {
        const userId = req.user.id; // From verifyToken middleware
        const chats = await Chats.find({ userId }).select('title createdAt updatedAt').sort({ updatedAt: -1 });

        res.status(200).json({ success: true, chats });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const conversation = await Chats.findOne({ _id: id, userId });

        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        res.status(200).json({ success: true, conversation });
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const deletedChat = await Chats.findOneAndDelete({ _id: id, userId });

        if (!deletedChat) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        res.status(200).json({ success: true, message: "Conversation deleted successfully" });
    } catch (error) {
        console.error("Error deleting conversation:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteAllChats = async (req, res) => {
    try {
        const userId = req.user.id;
        await Chats.deleteMany({ userId });
        res.status(200).json({ success: true, message: "All chats deleted successfully" });
    } catch (error) {
        console.error("Error deleting all chats:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
