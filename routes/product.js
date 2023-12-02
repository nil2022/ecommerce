// Import the required modules
const express = require('express');

// Import the controller functions from the 'product' file
const {
  createProduct,
  getAllProduct,
  filterBasedOnProduct,
  getProductOnId,
  updateProduct,
  deleteProduct
} = require('../controller/product');

// Import the middleware functions
const {
  validateProductData,
  verifyToken,
  isAdmin
} = require('../middleware');

// Create a new instance of the Express router
const routes = express.Router();

// Define the route for creating a new product
routes.post('/ecomm/api/v1/products', [validateProductData, verifyToken, isAdmin], createProduct);

// Define the route for getting all products
routes.get('/ecomm/api/v1/products', getAllProduct);

// Define the route for filtering products based on some criteria
routes.get('/ecomm/api/v1/products/filter', filterBasedOnProduct);

// Define the route for getting a specific product by its ID
routes.get('/ecomm/api/v1/products/:id', getProductOnId);

// Define the route for updating a product by its ID
routes.put('/ecomm/api/v1/products/:id', [verifyToken, isAdmin], updateProduct);

// Define the route for deleting a product by its ID
routes.delete('/ecomm/api/v1/products/:id', [verifyToken, isAdmin], deleteProduct);

// Export the routes object
module.exports = { productRoutes: routes };