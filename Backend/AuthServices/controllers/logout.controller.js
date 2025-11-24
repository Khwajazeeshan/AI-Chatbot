export const logout = (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            domain: "localhost"
        };

        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
