import React, { useEffect, useRef } from 'react'
import ChatInput from '../section3/ChatInput'
import './ChatContainer.css';
import { ChatData } from "../../context/ChatContext"
import { UserData } from "../../../Auth/context/AuthContext";
import AuthButtons from "../../../Auth/components/AuthButtons";

const ChatContainer = () => {
    const { isAuthenticated } = UserData();
    const { messages, loading: chatLoading, handleSend } = ChatData();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, chatLoading]);

    return (
        <div className='chatcontainer'>
            {!isAuthenticated && <AuthButtons />}
            {messages.length === 0 && <h1>How i can help you ?</h1>}
            <div className="chats">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.type}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
                {chatLoading && <div className="message ai"><p>Thinking...</p></div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="input"><ChatInput onSend={handleSend} /></div>
        </div>
    )
}

export default ChatContainer