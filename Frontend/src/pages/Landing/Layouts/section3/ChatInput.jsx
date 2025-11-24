import React, { useState } from "react";
import { FiMic } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import "./ChatInput.css";

const ChatInput = ({ onSend }) => {

    const [inputValue, setInputValue] = useState("");
    const [isListening, setIsListening] = useState(false);

    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser does not support speech recognition. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(prev => prev + (prev ? " " : "") + transcript);
        };

        recognition.start();
    };

    const handleSendClick = () => {
        if (inputValue.trim()) {
            if (onSend) {
                onSend(inputValue);
            }
            setInputValue("");
        }
    };

    return (
        <div className="chat-input-container">
            <input
                className="chat-input-field"
                type="text"
                placeholder="Ask anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendClick()}
            />
            <button
                className={`input-action-btn ${isListening ? 'listening' : ''}`}
                onClick={handleVoiceInput}
                title="Voice Input"
            >
                <FiMic />
            </button>
            <button
                className="input-action-btn send-btn"
                onClick={handleSendClick}
                title="Send Message"
            >
                <IoSend />
            </button>
        </div>
    );
};

export default ChatInput;
