import React from 'react'
import { NavLink } from 'react-router-dom'
import "./AuthButtons.css";

const AuthButtons = () => {
    return (
        <div className="auth-buttons-container">
            <NavLink to="/signup" className="auth-btn-link signup-btn">Signup</NavLink>
            <NavLink to="/login" className="auth-btn-link login-btn">Login</NavLink>
        </div>
    )
}

export default AuthButtons
