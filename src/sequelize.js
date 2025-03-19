import { Sequelize } from "sequelize"; // Use mysql2/promise for async/await
import env from "#utils/env"; // Adjust path based on your structure
import chalk from "chalk";

// Define database configuration for Sequelize
const config = {
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
    database: env.DB_NAME,
};

// Create the main Sequelize instance
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: "mysql",
        logging: false,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    }
);

export default sequelize;
