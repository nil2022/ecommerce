// src/config/db.config.js
import chalk from "chalk";
import { createDatabaseIfNotExists } from "#utils/helpers";
import sequelize from "#root/sequelize";


// Main database connection function
export async function dbConnect() {
    try {
        await createDatabaseIfNotExists();
        await sequelize.authenticate({ logging: false });
        console.log(chalk.greenBright("\nConnected to Hostname:", sequelize.config.host));
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
    }
};
