const {checkNameForCategory} = require('./category')
const { validateProductData } = require('./product')
const {checkDuplicateUsernameAndEmail, checkRoles} = require('./user')
const {verifyToken, isAdmin} = require('./authjwt')

module.exports = {
	checkNameForCategory,
	validateProductData,
	checkDuplicateUsernameAndEmail, checkRoles, verifyToken, isAdmin
}

async function foo(add){
	console.log('I am async func');
	return Promise.resolve();
};