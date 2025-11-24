import express from "express";
import { UserInfo } from "../controllers/User.controller.js";
import { DeleteAccount } from "../controllers/DeleteAccount.controller.js"
import { UpdateAccount } from "../controllers/UpdateAccount.controller.js"
import { verifyToken } from "../middleware/VerifyToken.js"

const router = express.Router();

router.get("/user", verifyToken, UserInfo);
router.delete("/DeleteAccount",verifyToken, DeleteAccount);
router.put("/UpdateAccount",verifyToken, UpdateAccount);

export default router;