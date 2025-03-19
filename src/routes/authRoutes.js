import express from "express";
const authRouter = express.Router();
import {
    signUp,
    signIn,
    logout,
    fetchAllUsers,
    changePassword,
} from "#controllers/authController";
import { checkRoles} from "#middlewares/user";
import { verifyToken } from "#middlewares/authjwt";

authRouter.post("/signup", [checkRoles], signUp);

authRouter.post("/login", signIn);

authRouter.get("/all-users", verifyToken, fetchAllUsers);

authRouter.post("/change-password", verifyToken, changePassword);

authRouter.get("/logout", verifyToken, logout);

export default authRouter;
