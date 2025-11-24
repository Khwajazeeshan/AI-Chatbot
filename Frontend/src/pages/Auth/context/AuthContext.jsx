import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const server = import.meta.env.VITE_AUTH_SERVER || "http://localhost:5000";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const res = await axios.get(`${server}/api/me`, { withCredentials: true });
            if (res.data?.authenticated === true) {
                setIsAuthenticated(true);
                setUser(res.data.user);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            // Silently handle auth errors
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setAuthLoading(false);
        }
    }

    async function Signup(data /*, navigate removed here - front will handle navigation/step */) {
        const { name, email, number, password, confirmPassword } = data;

        if (password !== confirmPassword) {
            toast.error("Password & ConfirmPassword Should be Same...");
            return Promise.reject(new Error("Password mismatch"));
        }

        try {
            // Use withCredentials to handle httpOnly cookies when finalizing signup. For initial OTP send it's not needed, but safe.
            const res = await axios.post(
                `${server}/api/signup`,
                { name, email, number, password, confirmPassword },
                { withCredentials: true }
            );

            if (res.data.success) {
                // Backend sent OTP to email and will create account upon verification
                toast.success(res.data.message || "OTP sent to your email for verification");
                // Return backend response so frontend can move to OTP step
                return res.data;
            } else {
                toast.error(res.data?.message || "Signup failed");
                throw new Error(res.data?.message || "Signup failed");
            }

        } catch (error) {
            console.error("Signup error:", error);
            if (error?.code === "ECONNABORTED") {
                toast.error("Server did not respond (timeout). Ensure backend is running and server URL is correct.");
            } else {
                toast.error(error.response?.data?.message || error.message || "Signup error");
            }
            throw error;
        }
    }

    // New: verify signup OTP and finalize account creation
    async function verifySignup(email, otp, navigate) {
        try {
            const res = await axios.post(`${server}/api/signup/verify`, { email, otp }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message || "Signup successful");
                await checkAuth(); // Update auth state
                navigate("/");
                window.location.reload();
                return true;
            } else {
                toast.error(res.data.message || "Verification failed");
                return false;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Verification error");
            return false;
        }
    }

    async function login(data, navigate) {
        const { email, password } = data;
        try {
            // withCredentials: true to send/receive cookies
            const res = await axios.post(`${server}/api/login`, { email, password }, { withCredentials: true });
            if (res.data.success) {
                // Cookies now store the tokens → no need to save in localStorage
                toast.success("Login Successfully");
                await checkAuth(); // Update auth state
                navigate("/");
                window.location.reload();
            } else {
                toast.error(res.data.message);
            }
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Login error");
        }
    }

    // Request OTP - returns true on success
    async function forgetPassword(email) {
        try {
            const res = await axios.put(`${server}/api/forget`, { email });
            if (res.data.success) {
                toast.success(res.data.message);
                return true;
            } else {
                toast.error(res.data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Forget Password error");
            return false;
        }
    }

    // Verify OTP - expects email and otp, returns true on success
    async function verifyotp(email, otp) {
        try {
            const res = await axios.post(`${server}/api/verify-otp`, { email, otp });
            if (res.data.success) {
                toast.success(res.data.message || "OTP verified");
                return true;
            } else {
                toast.error(res.data.message);
                return false;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "OTP verification failed");
            return false;
        }
    }

    // Reset password - expects email, password, confirmPassword
    async function newpassword(email, password, confirmPassword, navigate) {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        try {
            const res = await axios.post(`${server}/api/reset-password`, { email, password, confirmPassword });
            if (res.data.success) {
                toast.success(res.data.message || "Password reset successfully");
                navigate("/login")
            } else {
                toast.error(res.data.message);
                return false;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Password reset failed");
            return false;
        }
    }

    // Google login that opens a popup and listens for postMessage from backend callback

    function googleLogin(navigate, setLoadingGoogle = () => { }) {
        setLoadingGoogle(true);

        const width = 500;
        const height = 600;
        const left = window.innerWidth / 2 - width / 2;
        const top = window.innerHeight / 2 - height / 2;

        const popup = window.open(
            `${server}/api/google`,
            "GoogleLogin",
            `width=${width},height=${height},top=${top},left=${left}`
        );

        const receiveMessage = async (e) => {
            // Ensure message comes from backend origin
            if (e.origin !== server && e.origin !== new URL(server).origin) return;

            const { success, message } = e.data || {};

            if (success) {
                // Tokens are now in httpOnly cookies → no localStorage needed
                toast.success(message || "Google auth successful");
                await checkAuth(); // Update auth state
                navigate("/");
                window.location.reload();
            } else {
                toast.error(message || "Google auth failed");
            }

            setLoadingGoogle(false);
            window.removeEventListener("message", receiveMessage);
            if (popup) popup.close();
        };

        window.addEventListener("message", receiveMessage);
    }


    async function Logout(navigate) {
        const isConfirmed = window.confirm("Are you sure you want to log out?");
        if (!isConfirmed) return;
        try {
            const res = await axios.post(`${server}/api/logout`, {}, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message || "Logged out successfully");
                setIsAuthenticated(false);
                setUser(null);
                navigate("/"); // Navigate to home/landing
                window.location.reload();
                // Delay reload to allow toast to be seen
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(res.data.message || "Logout failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout error");
        }
    }

    return <AuthContext.Provider value={{ Signup, login, googleLogin, forgetPassword, verifyotp, newpassword, verifySignup, Logout, isAuthenticated, authLoading, user, checkAuth }}>{children}</AuthContext.Provider>
}

export const UserData = () => useContext(AuthContext)