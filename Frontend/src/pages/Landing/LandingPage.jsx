import React, { useState } from "react";
import { UserData } from "../Auth/context/AuthContext";
import UserDataComponent from "./Layouts/section1/UserData"
import ChatHistory from "./Layouts/section2/ChatHistory"
import ChatContainer from "./Layouts/section4/ChatContainer";
import "./LandingPage.css"
import { IoMenu, IoClose } from "react-icons/io5";

const Landing = () => {
    const { isAuthenticated, authLoading } = UserData();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (authLoading) return <div className="loading-screen">Loading...</div>;

    return (
        <div className='landing-page'>
            {isAuthenticated && (
                <>
                    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                        <div className="sidebar-header">
                            <h2>Menu</h2>
                            <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
                                <IoClose />
                            </button>
                        </div>
                        <div className='user-data-section'><UserDataComponent /></div>
                        <div className='chat-history-section'><ChatHistory /></div>
                    </div>
                    {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
                </>
            )}

            <div className={`main-content ${!isAuthenticated ? 'full-width' : ''}`}>
                {isAuthenticated && (
                    <div className="mobile-header">
                        <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
                            <IoMenu />
                        </button>
                        <span className="mobile-title">AI Chatbot</span>
                    </div>
                )}
                <div className='chat-container-wrapper'><ChatContainer /></div>
            </div>
        </div>
    );
};

export default Landing;
