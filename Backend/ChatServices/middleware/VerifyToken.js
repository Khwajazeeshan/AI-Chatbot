import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const Secret_key = process.env.JWT_ACCESS_SECRET;
        const decoded = jwt.verify(token, Secret_key);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};
