// index.js
import { dbConnect } from "#configs/dbConfig";
import sequelize from "#root/sequelize";
import app from "#root/app";
import env from "#utils/env";
import { initialize } from "#utils/helpers";
import chalk from "chalk";

dbConnect()
    .then(async () => {
        
        // Sync all models with the database (create tables if they don’t exist).
        // No force/alter: safe for production — only creates missing tables, never drops data.
        await sequelize.sync();
        console.log(chalk.bgGreenBright.white('\nDatabase tables synchronized !!\n'));

        /** Initalize app with default data after tables are created*/
        await initialize();

        // Start the server
        app.listen(env.PORT, () => {
            console.log(
                `Access server at => http://localhost:${env.PORT}`
            );
        });
    })
    .catch((err) => {
        console.log("Database Connection FAILED !!:", err);
        process.exit(1);
    });