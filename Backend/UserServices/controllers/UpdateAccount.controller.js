import express from "express";
import SignupModel from "../models/user.model.js";

export const UpdateAccount = async (req, res) => {
    try {

        const userId = req.user.id || req.user._id;

        const { name, phone } = req.body;  // ← FIXED

        const updatedUser = await SignupModel.findByIdAndUpdate(
            userId,
            { name, number: phone },   // ← FIXED (map phone → number field)
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Account updated successfully",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

