import { useForm } from "react-hook-form";
import { UserData } from "../context/UserContext";
import { MdCancel } from "react-icons/md";
import { NavLink } from "react-router-dom";
import "./UpdateInfo.css";

export default function UpdateInfo() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    const { HandleUpdate } = UserData()

    const onSubmit = async (data) => {
        await HandleUpdate(data)
    };

    return (
        <div className="update-wrapper">
            <div className="update-card">
                <NavLink to="/UserAccount" className="close-btn"><MdCancel /></NavLink>
                <h1 className="update-title">Update Info</h1>

                <form className="update-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            id="name"
                            className="form-input"
                            type="text"
                            placeholder="Enter your name"
                            {...register("name", {
                                required: "Name required",
                                minLength: { value: 5, message: "Min Length 5 characters" }
                            })}
                        />
                        {errors.name && <p className="form-error">{errors.name.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                            id="phone"
                            className="form-input"
                            type="text"
                            placeholder="Enter your phone number"
                            {...register("phone", {
                                required: "Phone required",
                                minLength: { value: 11, message: "Min Length 11 digits" }
                            })}
                        />
                        {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                    </div>

                    <button className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update"}
                    </button>
                </form>
            </div>
        </div>
    );
}
