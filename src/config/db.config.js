import chalk from "chalk";
import { Sequelize } from "sequelize";

const { DB_URL_MYSQL, DATABASE_USER = 'root', DATABASE_PASSWORD = 'root', DATABASE_NAME  = 'ecomm'} =
    process.env;

const sequelizeInstance = new Sequelize(DB_URL_MYSQL, {
  dialect: "mysql",
  // logging: false,
  logging: (msg) => console.log(chalk.yellow(msg)),
});

async function dbConnect() {
    await sequelizeInstance.authenticate();
    console.log("\nConnected to Hostname:", sequelizeInstance.options.host);
    // console.log('sequelizeInstance', sequelizeInstance.options)
}

export { dbConnect, sequelizeInstance };
