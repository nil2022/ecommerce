import express from "express";
const authRouter = express.Router();
import {
    signUp,
    signIn,
    logout,
    fetchAllUsers,
    changePassword,
} from "../controller/auth.controller.js";
import { checkRoles, verifyToken } from "../middleware/index.js";

authRouter.post("/signup", [checkRoles], signUp);

authRouter.post("/login", signIn);

authRouter.get("/all-users", verifyToken, fetchAllUsers);

authRouter.post("/change-password", verifyToken, changePassword);

authRouter.get("/logout", verifyToken, logout);

export default authRouter;
