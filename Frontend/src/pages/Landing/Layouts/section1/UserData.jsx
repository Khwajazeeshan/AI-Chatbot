import React from 'react'
import { NavLink } from 'react-router-dom'
import { ChatData } from '../../context/ChatContext'
import { FaUserCircle, FaPlus } from "react-icons/fa";
import "./UserData.css";

const UserData = () => {
    const { resetChat } = ChatData();
    return (
        <div className="user-data-container">
            <div className="app-logo">
                <img src="/icon.png" alt="AI Chatbot" onError={(e) => e.target.style.display = 'none'} />
                <span>AI Chatbot</span>
            </div>

            <button className="new-chat-btn" onClick={resetChat}>
                <FaPlus /> New Chat
            </button>

            <NavLink to="/UserAccount" className="profile-link">
                <FaUserCircle className="profile-icon" />
                <span>My Account</span>
            </NavLink>
        </div>
    )
}

export default UserData
