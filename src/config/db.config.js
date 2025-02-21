// src/config/db.config.js
import chalk from "chalk";
import { Sequelize } from "sequelize";
import mysql from "mysql2/promise"; // Use mysql2/promise for async/await
import env from "../utils/env.js"; // Adjust path based on your structure

// Define database configuration for Sequelize
const config = {
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
    database: env.DB_NAME,
};

// Create the main Sequelize instance
const sequelizeInstance = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: "mysql",
    logging: env.NODE_ENV == 'dev' ? (msg) => console.log(chalk.yellow(msg)) : false,
});

// Function to check and create database if it doesn't exist using mysql2
async function createDatabaseIfNotExists() {
    // Create a raw MySQL connection without specifying a database
    const connection = await mysql.createConnection({
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        port: env.DB_PORT,
    });

    try {
        // Check if the database exists by querying the list of databases
        const [rows] = await connection.query(`SHOW DATABASES LIKE '${env.DB_NAME}';`);
        
        if (rows.length === 0) {
            // Database doesn’t exist, so create it
            await connection.query(`CREATE DATABASE \`${env.DB_NAME}\`;`);
            console.log(`Database '${env.DB_NAME}' created.`);
        } else {
            console.log(`Database '${env.DB_NAME}' already exists.`);
        }
    } catch (error) {
        console.error("Error checking/creating database:", error);
        throw error;
    } finally {
        // Close the raw MySQL connection
        await connection.end();
    }
}

// Main database connection function
async function dbConnect() {
    try {
        await createDatabaseIfNotExists();
        await sequelizeInstance.authenticate();
        console.log("\nConnected to Hostname:", sequelizeInstance.config.host);
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
    }
}

export { dbConnect, sequelizeInstance };