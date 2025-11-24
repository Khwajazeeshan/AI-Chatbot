import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserData } from '../../context/AuthContext';
import './Login.css';
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: "onChange" });
    const [showPassword, setShowPassword] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = React.useState(false);
    const navigate = useNavigate();
    const { login, googleLogin } = UserData();

    const onSubmit = async (data) => {
        await login(data, navigate);
    };

    return (
        <div className="lg-wrapper">
            <button className="lg-close-btn fa-solid fa-xmark" onClick={() => navigate("/")}></button>

            <div className="lg-card">
                <h1 className="lg-title">Welcome Back</h1>

                {/* FORM */}
                <form className="lg-form" onSubmit={handleSubmit(onSubmit)}>

                    {/* EMAIL */}
                    <input
                        type="email"
                        className="lg-input"
                        placeholder="Enter your email"
                        {...register("email", {
                            required: "Email is required",
                            minLength: { value: 3, message: "Email must be at least 3 characters" },
                        })}
                    />
                    {errors.email && <p className="lg-error">{errors.email.message}</p>}

                    {/* PASSWORD */}
                    <div className="lg-pass-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="lg-input"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 5, message: "Password must be at least 5 characters" },
                            })}
                        />
                        <i
                            className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>
                    {errors.password && <p className="lg-error">{errors.password.message}</p>}

                    <button className="lg-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Please Wait..." : "Login"}
                    </button>
                </form>

                <div className="lg-links">
                    <NavLink to="/forget" className="lg-link">Forgot Password?</NavLink>
                    <NavLink to="/signup" className="lg-link">Create Account</NavLink>
                </div>
                <button
                    type="button"
                    className="google-auth-btn"
                    onClick={() => googleLogin(navigate, setLoadingGoogle)}
                    disabled={loadingGoogle}
                >
                    {loadingGoogle ? (
                        "Processing..."
                    ) : (
                        <>
                            <FcGoogle style={{ marginRight: "8px", fontSize: "1.3rem" }} />
                            Continue with Google
                        </>
                    )}
                </button>
            </div>

        </div>
    );
};

export default Login;
