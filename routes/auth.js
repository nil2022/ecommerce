// Import the express module
const express = require('express')
// Create a router object
const routes = express.Router()
// Import the signUp and signIn functions from the auth controller
const { signUp,signIn } = require('../controller/auth')
// Import the checkDuplicateUsernameAndEmail and checkRoles middleware functions
const {checkDuplicateUsernameAndEmail, checkRoles} = require('../middleware')

// Define a route for signing up users
routes.post('/ecomm/api/v1/auth/signup',[checkDuplicateUsernameAndEmail, checkRoles],
signUp)
// Define a route for signing in users
routes.post('/ecomm/api/v1/auth/signin',signIn)

// Export the router object as authRoutes
module.exports = {
    authRoutes : routes
}