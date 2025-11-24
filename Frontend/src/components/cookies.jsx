import React, { useState, useEffect } from "react";
import "./cookies.css";

const CookiesCard = () => {
    const [showCard, setShowCard] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookiesAccepted");
        if (!consent) setShowCard(true);
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookiesAccepted", "true");
        setShowCard(false);
    };

    const handleReject = () => {
        localStorage.setItem("cookiesAccepted", "false");
        setShowCard(false);
    };

    if (!showCard) return null;

    return (
        <div className="cookie-popup">
            <p className="cookie-text">We use cookies to improve your browsing experience.</p>

            <div className="cookie-btn-group">
                <button className="cookie-btn accept-btn" onClick={handleAccept}>
                    Accept All
                </button>

                <button className="cookie-btn reject-btn" onClick={handleReject}>
                    Reject
                </button>
            </div>
        </div>
    );
};

export default CookiesCard;
