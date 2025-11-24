import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const chatServer = import.meta.env.VITE_CHAT_SERVER || "http://localhost:7001";

const ChatContext = createContext();

export const ChatProvider = ({ children, isAuthenticated }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);

    async function fetchChatHistory() {
        // Only fetch if authenticated
        if (!isAuthenticated) {
            setChatHistory([]);
            return;
        }

        try {
            const res = await axios.get(`${chatServer}/api/history`, { withCredentials: true });
            if (res.data.success) {
                setChatHistory(res.data.chats);
            }
        } catch (error) {
            // Silently handle 403/401 errors (user not authenticated)
            if (error.response?.status !== 403 && error.response?.status !== 401) {
                console.error("Error fetching chat history:", error);
            }
        }
    }

    useEffect(() => {
        fetchChatHistory();
    }, [isAuthenticated]);

    async function handleSend(question) {
        if (!question.trim()) return;

        const newMessages = [...messages, { type: 'user', text: question }];
        setMessages(newMessages);
        setLoading(true);

        try {
            console.log("📤 Sending question to backend:", question);
            const res = await axios.post(`${chatServer}/api/chat`, {
                question,
                conversationId: currentConversationId
            }, { withCredentials: true });

            console.log("✅ Response received:", res.data);
            const answer = res.data.answer;

            // Update conversation ID if it's a new chat
            if (res.data.conversationId) {
                setCurrentConversationId(res.data.conversationId);
            }

            setMessages([...newMessages, { type: 'ai', text: answer }]);

            // Refresh history after sending a message (if authenticated)
            fetchChatHistory();
        } catch (error) {
            console.error("❌ Error sending message:", error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Sorry, something went wrong.";

            setMessages([...newMessages, { type: 'ai', text: errorMessage }]);
        } finally {
            setLoading(false);
        }
    }

    const resetChat = () => {
        setMessages([]);
        setCurrentConversationId(null);
    };

    const deleteChat = async (id) => {
        if (!window.confirm("Are you sure you want to delete this chat?")) return;

        try {
            const res = await axios.delete(`${chatServer}/api/history/${id}`, { withCredentials: true });
            if (res.data.success) {
                toast.success("Chat deleted successfully");
                fetchChatHistory();
                // If deleted chat is current one, reset
                if (currentConversationId === id) {
                    resetChat();
                }
            }
        } catch (error) {
            toast.error("Failed to delete chat");
            console.error("Delete error:", error);
        }
    };

    const deleteAllChats = async () => {
        if (!window.confirm("Are you sure you want to delete ALL chats? This cannot be undone.")) return;

        try {
            const res = await axios.delete(`${chatServer}/api/history`, { withCredentials: true });
            if (res.data.success) {
                toast.success("All chats deleted successfully");
                fetchChatHistory();
                resetChat();
            }
        } catch (error) {
            toast.error("Failed to delete all chats");
            console.error("Delete all error:", error);
        }
    };

    const loadConversation = async (conversationId) => {
        try {
            const res = await axios.get(`${chatServer}/api/history/${conversationId}`, { withCredentials: true });
            if (res.data.success) {
                const conversation = res.data.conversation;

                // Convert messages from backend format to frontend format
                const formattedMessages = conversation.messages.map(msg => ({
                    type: msg.role,
                    text: msg.content
                }));

                setMessages(formattedMessages);
                setCurrentConversationId(conversationId);
                toast.success("Conversation loaded");
            }
        } catch (error) {
            toast.error("Failed to load conversation");
            console.error("Load conversation error:", error);
        }
    };

    return <ChatContext.Provider value={{ handleSend, messages, loading, resetChat, chatHistory, fetchChatHistory, deleteChat, deleteAllChats, loadConversation }}>{children}</ChatContext.Provider>
}

export const ChatData = () => useContext(ChatContext)