import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import { UserData } from "../context/UserContext"
import { NavLink } from 'react-router-dom'
import { MdCancel } from "react-icons/md";
import "./UserAccount.css";

const server = import.meta.env.VITE_USER_SERVER || "http://localhost:6001";

const UserAccount = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const { HandleDelete: deleteAccount } = UserData();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${server}/api/user`, {
                    withCredentials: true
                });
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const HandleDelete = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            setDeleting(true);
            try {
                await deleteAccount();
            } finally {
                setDeleting(false);
            }
        }
    }

    if (loading) return <div className="loading-screen">Loading...</div>;

    return (
        <div className="account-wrapper">
            <div className="account-card">
                <button className="close-btn" onClick={() => navigate("/")}>
                    <MdCancel />
                </button>

                <h1 className="account-title">Account Details</h1>

                {user ? (
                    <div className="account-info">
                        <div className="info-item">
                            <span className="info-label">Name</span>
                            <span className="info-value">{user.name}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email</span>
                            <span className="info-value">{user.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Phone Number</span>
                            <span className="info-value">{user.number}</span>
                        </div>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Please login to view account details.
                    </p>
                )}

                <div className="account-actions">
                    <NavLink to="/update" className="update-btn">Update Account Details</NavLink>
                    <button className="delete-btn" onClick={HandleDelete} disabled={deleting}>
                        {deleting ? "Account Deleting..." : "Delete Account"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserAccount