import express from "express";

// Import the controller functions from the 'product' file
import {
    createProduct,
    getAllProduct,
    filterBasedOnProduct,
    getProductOnId,
    updateProduct,
    deleteProduct,
} from "../controller/product.js";

// Import the middleware functions
import {
    validateProductData,
    verifyToken,
    isAdmin,
} from "../middleware/index.js";

// Create a new instance of the Express router
const router = express.Router();

// Define the route for creating a new product
router.post(
    "/add",
    [validateProductData, verifyToken, isAdmin],
    createProduct
);

// Define the route for getting all products
router.get("/getAll", getAllProduct);

// Define the route for filtering products based on some criteria
router.get("/filter", filterBasedOnProduct);

// Define the route for getting a specific product by its ID
router.get("/getOne", getProductOnId);

// Define the route for updating a product by its ID
router.patch("/updateOne", [verifyToken, isAdmin], updateProduct);

// Define the route for deleting a product by its ID
router.delete("/deleteOne", [verifyToken, isAdmin], deleteProduct);

// Export the routes object
export default router;
