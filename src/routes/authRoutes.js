import express from "express";
const authRouter = express.Router();
import { login, logout, fetchAllUsers, changePassword, register } from "#controllers/authController";
import { checkRoles } from "#utils/helpers";
import { verifyToken } from "#middlewares/authjwt";

authRouter.post("/register", [checkRoles], register);

authRouter.post("/login", login);

authRouter.get("/all-users", verifyToken, fetchAllUsers);

authRouter.patch("/change-password", verifyToken, changePassword);

authRouter.get("/logout", verifyToken, logout);

export default authRouter;
