// Import the express module
import express from "express";
// Create a router object
const authRouter = express.Router();
// Import the signUp and signIn functions from the auth controller
import { signUp, signIn, logout, fetchAllUsers, changePassword } from "../controller/auth.controller.js";
// Import the checkDuplicateUsernameAndEmail and checkRoles middleware functions
import { checkRoles, verifyToken,} from "../middleware/index.js";

// Define a route for signing up users
authRouter.post("/signup", [checkRoles], signUp );
// Define a route for signing in users
authRouter.post("/login", signIn);

authRouter.get("/all-users", verifyToken, fetchAllUsers)

authRouter.post("/change-password", verifyToken, changePassword)

authRouter.get("/logout", verifyToken, logout)

// Export the authRouter object as authRoutes
export default authRouter;
