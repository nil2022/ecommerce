// Import the express module
import express from "express";
// Create a router object
const router = express.Router();
// Import the signUp and signIn functions from the auth controller
import { signUp, signIn } from "../controller/auth.controller.js";
// Import the checkDuplicateUsernameAndEmail and checkRoles middleware functions
import {
    checkDuplicateUsernameAndEmail,
    checkRoles,
} from "../middleware/index.js";

// Define a route for signing up users
router.post(
    "/signup",
    [checkDuplicateUsernameAndEmail, checkRoles],
    signUp
);
// Define a route for signing in users
router.post("/signin", signIn);

// Export the router object as authRoutes
export default router;
