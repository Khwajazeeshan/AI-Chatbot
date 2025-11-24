import { createContext, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const server = import.meta.env.VITE_USER_SERVER || "http://localhost:6001";

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const navigate = useNavigate();

    async function HandleUpdate(data) {
        const isConfirmed = window.confirm("Are you sure you want to update your Account Details?");
        if (isConfirmed) {
            try {
                const response = await axios.put(`${server}/api/UpdateAccount`, data, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    toast.success(response.data.message);
                    navigate("/UserAccount");
                }
            } catch (error) {
                console.error("Error updating user:", error);
            }
        }
    }

    async function HandleDelete() {
        const isConfirmed = window.confirm("Are you sure you want to delete your account?");
        if (isConfirmed) {
            try {
                const response = await axios.delete(`${server}/api/DeleteAccount`, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    toast.success(response.data.message);
                    navigate("/");
                    window.location.reload();
                }

            } catch (error) {
                console.error("Error in user Account Deleting:", error);
            }
        }
    }

    return <UserContext.Provider value={{ HandleDelete, HandleUpdate }}>{children}</UserContext.Provider>
}

export const UserData = () => useContext(UserContext)