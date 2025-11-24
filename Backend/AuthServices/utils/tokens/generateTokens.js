import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

const Secret_key = process.env.JWT_ACCESS_SECRET;
const Refresh_Key = process.env.JWT_REFRESH_SECRET

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, Secret_key, {
    expiresIn: "30m",
  });

  const refreshToken = jwt.sign({ id: userId }, Refresh_Key, {
    expiresIn: "3d",
  });

  return { accessToken, refreshToken };
};
