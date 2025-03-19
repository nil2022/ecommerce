import express from "express";

// Import the controller functions from the 'product' file
import {
    createProduct,
    getAllProduct,
    filterBasedOnProduct,
    getProductOnId,
    updateProduct,
    deleteProduct,
} from "#controllers/productController";

// Import the middleware functions
import { validateProductData } from "#middlewares/product";
import { verifyToken, isAdmin } from "#middlewares/authjwt";

// Create a new instance of the Express productRouter
const productRouter = express.Router();

// Define the route for creating a new product
productRouter.post(
    "/add",
    [verifyToken, validateProductData, isAdmin],
    createProduct
);

// Define the route for getting all products
productRouter.get("/getAll", [verifyToken], getAllProduct);

// Define the route for filtering products based on some criteria
productRouter.get("/filter", [verifyToken], filterBasedOnProduct);

// Define the route for getting a specific product by its ID
productRouter.get("/getOne", [verifyToken], getProductOnId);

// Define the route for updating a product by its ID
productRouter.patch("/updateOne", [verifyToken, isAdmin], updateProduct);

// Define the route for deleting a product by its ID
productRouter.delete("/deleteOne", [verifyToken, isAdmin], deleteProduct);

// Export the routes object
export default productRouter;
