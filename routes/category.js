const express = require('express')
const {createCategory, getAllCategory,
getCategoryOnId, updateCategory, deleteCategory} = require('../controller/category')

const { checkNameForCategory, verifyToken, isAdmin } = require('../middleware')

const routes = express.Router()


routes.post('/ecomm/api/v1/categories',[checkNameForCategory, verifyToken, isAdmin],createCategory)

routes.get('/ecomm/api/v1/categories',getAllCategory)

routes.get('/ecomm/api/v1/category', getCategoryOnId)

routes.patch('/ecomm/api/v1/category',[verifyToken, isAdmin], updateCategory)

routes.delete('/ecomm/api/v1/category',[verifyToken, isAdmin], deleteCategory)

module.exports = {categoryRoutes : routes}