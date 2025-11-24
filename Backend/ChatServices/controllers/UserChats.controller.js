import Groq from "groq-sdk";
import dotenv from "dotenv";
import Chats from "../models/Chats.model.js";
import jwt from 'jsonwebtoken';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const UserChats = async (req, res) => {
    const { question, conversationId } = req.body;

    // Check if GROQ_API_KEY is configured
    if (!process.env.GROQ_API_KEY) {
        console.error("❌ GROQ_API_KEY is not configured in .env file");
        return res.status(500).json({
            message: "Server configuration error: GROQ_API_KEY is missing"
        });
    }

    if (!question) {
        return res.status(400).json({ message: "Question is required" });
    }

    console.log("📨 Received question:", question);

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Always answer in 2 lines. If the user asks for details, answer in 6-7 lines."
                },
                {
                    role: "user",
                    content: question,
                },
            ],
            model: "llama-3.3-70b-versatile",
        });


        const answer = chatCompletion.choices[0]?.message?.content || "No answer generated.";
        console.log("✅ Successfully generated answer");

        // Check for authentication and save chat if authenticated
        const token = req.cookies.accessToken;
        let newConversationId = conversationId;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
                const userId = decoded.id;

                if (conversationId) {
                    // Append to existing conversation
                    const conversation = await Chats.findOne({ _id: conversationId, userId });
                    if (conversation) {
                        conversation.messages.push({ role: 'user', content: question });
                        conversation.messages.push({ role: 'ai', content: answer });
                        await conversation.save();
                        console.log("💾 Chat appended to conversation:", conversationId);
                    } else {
                        // Handle case where ID exists but not found (maybe deleted), create new?
                        // For now, treat as new if not found is safer or error out. 
                        // Let's create new to be safe/resilient.
                        const newChat = await Chats.create({
                            userId,
                            title: question.substring(0, 30),
                            messages: [
                                { role: 'user', content: question },
                                { role: 'ai', content: answer }
                            ]
                        });
                        newConversationId = newChat._id;
                        console.log("💾 New conversation created (ID not found):", newConversationId);
                    }
                } else {
                    // Create new conversation
                    const newChat = await Chats.create({
                        userId,
                        title: question.substring(0, 30),
                        messages: [
                            { role: 'user', content: question },
                            { role: 'ai', content: answer }
                        ]
                    });
                    newConversationId = newChat._id;
                    console.log("💾 New conversation created:", newConversationId);
                }

            } catch (err) {
                console.log("⚠️ Token verification failed or DB error, chat not saved:", err.message);
                // Continue without saving if token is invalid
            }
        }

        res.status(200).json({ answer, conversationId: newConversationId });
    } catch (error) {
        console.error("❌ Error in UserChats:");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Full error:", JSON.stringify(error, null, 2));

        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            details: error.response?.data || "No additional details"
        });
    }
};