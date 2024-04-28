import { Sequelize } from "sequelize";

const sequelizeInstance = new Sequelize(process.env.DB_URL_POSTGRESQL, {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
		
    },
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false,
    //     }
    // }
    
});
async function dbConnect() {
    await sequelizeInstance.authenticate();
    console.log("\nConnected to Hostname:", sequelizeInstance.options.host);
	// console.log('sequelizeInstance', sequelizeInstance.options)
}

export { dbConnect, sequelizeInstance };
