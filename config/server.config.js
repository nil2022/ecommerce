if(process.env.NODE_ENV !== 'development'){
	require('dotenv').config()
}

module.exports = {
	serverPort: process.env.PORT
}


