const {serverPort} = require('./config/server.config')
const express = require('express')
const { Categories, sequelize, Products, Role, User } = require('./models')
const {categoryRoutes, productRoutes, authRoutes, cartRoutes} = require('./routes')
const app = express()
const logger = require('morgan')
const bcrypt = require('bcrypt')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(authRoutes)
app.use(categoryRoutes)
app.use(productRoutes)
app.use(cartRoutes)

app.use(logger('combined'))

app.get('/', (req, res) => {
	res.status(200).send('Server is up and running');
})

app.listen(serverPort, async ()=> {
	console.log(`\nServer is running on this port: ${serverPort}\n`)
	await init()
})

async function init(){
	try{
		await sequelize.sync({force: true})
// raw data to be stored in database
		const defaultProducts = [
		{
		    "description":"Nyka best products",
		    "name" :"MakeUP Kit",
		    "cost": 870,
		    "quantity": 20,
			"CategoryId": 1
		},
		{
    		"description":"Best fragnance",
		    "name" :"Fogg",
		    "cost": 280,
		    "quantity": 20,
			"CategoryId": 2
		},
		{
    		"description":"Best for summer holidays",
		    "name" :"Summer Clothes",
		    "cost": 1200,
		    "quantity": 20,
			"CategoryId": 3
		}
]

		const defaultCategories = [
		{
			name : 'Beauty',
			description: 'All beauty Products'
		},
		{
			name: 'Fragnance',
			description: 'All Fragnance Products'
		},
		{
			name: 'Clothes',
			description: 'All types of Clothes'
		}
		]

		const defaultRoles = [
		{
			name : 'User'
		},
		{
			name: 'Admin',
		}
		]

		// const defaultUser = [
		// {
		// 	username : 'admin',
		// 	password : bcrypt.hashSync('admin', 10),
		// 	email : 'admin@admin.com'
		// }
		// ]
		
		await Categories.bulkCreate(defaultCategories)
		await Products.bulkCreate(defaultProducts)
		await Role.bulkCreate(defaultRoles)
		// await User.bulkCreate(defaultUser)
	}
	catch(err){
		console.log("Error:",err)
	}

}
