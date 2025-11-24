import React, { useState } from 'react'
import { UserData } from "../../../Auth/context/AuthContext";
import { ChatData } from "../../context/ChatContext";
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdLogout } from "react-icons/md";
import './ChatHistory.css';

const ChatHistory = () => {
    const [loggingOut, setLoggingOut] = useState(false);
    const { Logout } = UserData();
    const { chatHistory, deleteChat, deleteAllChats, loadConversation } = ChatData();
    const navigate = useNavigate();

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await Logout(navigate);
        } finally {
            setLoggingOut(false);
        }
    };

    const handleChatClick = (chatId) => {
        loadConversation(chatId);
    };

    return (
        <div className="chat-history-container">
            <div className="history-title">Recent Chats</div>
            <div className="history-list">
                {chatHistory && chatHistory.length > 0 ? (
                    chatHistory.map((chat) => (
                        <div key={chat._id} className="history-item">
                            <p
                                className="history-question"
                                onClick={() => handleChatClick(chat._id)}
                                title={chat.title}
                            >
                                {chat.title}
                            </p>
                            <button
                                className="delete-chat-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat(chat._id);
                                }}
                                title="Delete Chat"
                            >
                                <MdDelete size={18} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="no-history">No chat history yet</div>
                )}
            </div>

            <div className="history-footer">
                {chatHistory && chatHistory.length > 1 && (
                    <button className="delete-all-btn" onClick={deleteAllChats}>
                        Delete All Chats
                    </button>
                )}
                <button className="logout-btn" onClick={handleLogout} disabled={loggingOut}>
                    <MdLogout />
                    {loggingOut ? "Logging out..." : "Log out"}
                </button>
            </div>
        </div>
    )
}

export default ChatHistory
