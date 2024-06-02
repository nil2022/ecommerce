// Import the express module
import express from "express";
// Create a router object
const router = express.Router();
// Import the signUp and signIn functions from the auth controller
import { signUp, signIn, logout, fetchAllUsers, changePassword } from "../controller/auth.controller.js";
// Import the checkDuplicateUsernameAndEmail and checkRoles middleware functions
import { checkRoles, verifyToken,} from "../middleware/index.js";

// Define a route for signing up users
router.post("/signup", [checkRoles], signUp );
// Define a route for signing in users
router.post("/signin", signIn);

router.get("/all-users", verifyToken, fetchAllUsers)

router.post("/change-password", verifyToken, changePassword)

router.get("/logout", verifyToken, logout)

// Export the router object as authRoutes
export default router;
