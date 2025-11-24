import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserData } from "../../context/AuthContext";
import "./Forget.css";

const Forget = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        mode: "onChange",
    });

    const { forgetPassword, verifyotp, newpassword } = UserData();

    // Step 1: Email
    const handleEmailSubmit = async (data) => {
        const ok = await forgetPassword(data.email);
        if (ok) {
            setEmail(data.email);
            setStep(2);
        }
    };

    // Step 2: OTP
    const handleOtpSubmit = async () => {
        const otp = inputsRef.current.map((i) => i?.value || "").join("");
        if (otp.length !== 6) return toast.error("Enter 6-digit OTP");

        const ok = await verifyotp(email, otp);
        if (ok) setStep(3);
    };

    const handleChange = (e, index) => {
        if (e.target.value && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    // Step 3: Reset Password
    const handlePasswordSubmit = async (data) => {
        await newpassword(email, data.password, data.confirmPassword, navigate);
    };

    return (
        <div className="fp-wrapper">
            <button className="fp-close-btn fa-solid fa-xmark" onClick={() => navigate("/")}></button>

            <div className="fp-card">

                <h1 className="fp-title">Reset Password</h1>

                {/* Step 1: Email */}
                {step === 1 && (
                    <form className="fp-form" onSubmit={handleSubmit(handleEmailSubmit)}>
                        <input
                            className="fp-input"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && <p className="fp-error">{errors.email.message}</p>}

                        <button className="fp-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP */}
                {step === 2 && (
                    <div className="fp-form">
                        <p className="fp-info">Enter the 6-digit code sent to your email</p>

                        <div className="fp-otp-box">
                            {Array(6).fill("").map((_, i) => (
                                <input
                                    key={i}
                                    maxLength="1"
                                    className="fp-otp-input"
                                    type="text"
                                    ref={(el) => (inputsRef.current[i] = el)}
                                    onChange={(e) => handleChange(e, i)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                />
                            ))}
                        </div>

                        <button className="fp-btn" onClick={handleOtpSubmit}>Verify OTP</button>
                        <button className="fp-cancel" onClick={() => setStep(1)}>Cancel</button>
                    </div>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <form className="fp-form" onSubmit={handleSubmit(handlePasswordSubmit)}>
                        <div className="fp-pass-box">
                            <input
                                className="fp-input"
                                type={show1 ? "text" : "password"}
                                placeholder="New Password"
                                {...register("password", {
                                    required: "Password required",
                                    minLength: { value: 5, message: "Password must be at least 5 characters" }
                                })}
                            />
                            <i
                                className={show1 ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setShow1(!show1)}
                            ></i>
                        </div>
                        {errors.password && <p className="fp-error">{errors.password.message}</p>}

                        <div className="fp-pass-box">
                            <input
                                className="fp-input"
                                type={show2 ? "text" : "password"}
                                placeholder="Confirm Password"
                                {...register("confirmPassword", {
                                    required: "Confirm password required",
                                    minLength: { value: 5, message: "Password must be at least 5 characters" }
                                })}
                            />
                            <i
                                className={show2 ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setShow2(!show2)}
                            ></i>
                        </div>
                        {errors.confirmPassword && <p className="fp-error">{errors.confirmPassword.message}</p>}

                        <button className="fp-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <div className="fp-links">
                    <NavLink to="/login" className="fp-link">Back to Login</NavLink>
                </div>

            </div>
        </div>
    );
};

export default Forget;
