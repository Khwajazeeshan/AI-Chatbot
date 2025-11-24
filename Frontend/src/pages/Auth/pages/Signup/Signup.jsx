// ================== SIGNUP JSX ==================
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Signup.css';
import { UserData } from '../../context/AuthContext';
import { FcGoogle } from "react-icons/fc"; // import Google icon

const Signup = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: 'onChange' });
    const [step, setStep] = useState(1);
    const [showPass1, setShowPass1] = React.useState(false);
    const [showPass2, setShowPass2] = React.useState(false);
    const [loadingGoogle, setLoadingGoogle] = React.useState(false);
    const navigate = useNavigate();

    const { Signup, googleLogin, verifySignup } = UserData();

    const [signupEmail, setSignupEmail] = useState("");
    const inputsRef = useRef([]);
    const [otpValues, setOtpValues] = useState(Array(6).fill(""));

    const onSubmit = async (data) => {
        try {
            const res = await Signup(data);
            if (res?.success) {
                setSignupEmail(data.email);
                setStep(2);
                // focus first OTP input after a tick
                setTimeout(() => inputsRef.current[0]?.focus(), 100);
            }
        } catch (err) {
            // Signup function already toasts errors; no-op
            console.error(err);
        }
    };

    const handleChange = (e, idx) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 1); // only digits
        const newOtp = [...otpValues];
        newOtp[idx] = val;
        setOtpValues(newOtp);
        if (val && idx < 5) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace" && !otpValues[idx] && idx > 0) {
            const prev = inputsRef.current[idx - 1];
            prev?.focus();
        }
    };

    const handleOtpSubmit = async () => {
        const code = otpValues.join("");
        if (code.length !== 6) {
            // basic feedback
            alert("Enter the 6-digit OTP");
            return;
        }
        const ok = await verifySignup(signupEmail, code, navigate);
        if (!ok) {
            // keep on OTP step; user gets toast from context
        }
    };

    return (
        <div className="auth-wrapper">
            <button className="close-btn fa-solid fa-xmark" onClick={() => navigate("/")}></button>

            {step === 1 && (
                <div className="auth-card">
                    <h1 className="auth-title">Create Account</h1>

                    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>

                        <input
                            className="auth-input"
                            type="text"
                            placeholder="Enter Name"
                            {...register('name', {
                                required: 'Name is required',
                                minLength: { value: 5, message: "Name must be at least 5 characters" }
                            })}
                        />
                        {errors.name && <p className="auth-error">{errors.name.message}</p>}

                        <input
                            className="auth-input"
                            type="email"
                            placeholder="Enter Email"
                            {...register('email', {
                                required: 'Email is required',
                                minLength: { value: 3, message: "Email must be at least 3 characters" }
                            })}
                        />
                        {errors.email && <p className="auth-error">{errors.email.message}</p>}

                        <input
                            className="auth-input"
                            type="text"
                            placeholder="Enter Mobile Number"
                            {...register('number', {
                                required: 'Number is required',
                                minLength: { value: 11, message: "Number must be at least 11 digits" }
                            })}
                        />
                        {errors.number && <p className="auth-error">{errors.number.message}</p>}

                        <div className="auth-pass-box">
                            <input
                                className="auth-input"
                                type={showPass1 ? "text" : "password"}
                                placeholder="Enter Password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 5, message: "Password must be at least 5 characters" }
                                })}
                            />
                            <i
                                className={showPass1 ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setShowPass1(!showPass1)}
                            ></i>
                        </div>
                        {errors.password && <p className="auth-error">{errors.password.message}</p>}

                        <div className="auth-pass-box">
                            <input
                                className="auth-input"
                                type={showPass2 ? "text" : "password"}
                                placeholder="Confirm Password"
                                {...register('confirmPassword', {
                                    required: 'Confirm Password is required',
                                    minLength: { value: 5, message: "Password must be at least 5 characters" }
                                })}
                            />
                            <i
                                className={showPass2 ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setShowPass2(!showPass2)}
                            ></i>
                        </div>
                        {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword.message}</p>}

                        <button className="auth-btn" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Create Account'}
                        </button>

                        <p className="auth-switch-text">
                            Already have an account? <NavLink to="/login" className="auth-link">Login</NavLink>
                        </p>

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

                    </form>
                </div>
            )}


            {step === 2 && (
                <div className="fp-form">
                    <p className="fp-info" style={{ color: "white" }}>Enter Verification code </p>

                    <div className="fp-otp-box">
                        {Array(6).fill("").map((_, i) => (
                            <input
                                key={i}
                                maxLength="1"
                                className="fp-otp-input"
                                type="text"
                                ref={(el) => (inputsRef.current[i] = el)}
                                value={otpValues[i]}
                                onChange={(e) => handleChange(e, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                            />
                        ))}
                    </div>

                    <button className="fp-btn" onClick={handleOtpSubmit}>Verify OTP</button>
                    <button className="fp-cancel" onClick={() => setStep(1)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Signup;
