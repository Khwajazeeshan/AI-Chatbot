import SignupModel from "../models/user.model.js";

export const UserInfo = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        const user = await SignupModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
