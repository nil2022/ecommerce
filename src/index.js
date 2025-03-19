// index.js
import { dbConnect, sequelizeInstance } from "#configs/dbConfig";
import app from "#root/app";
import env from "#utils/env";
import { initialize } from "#utils/helpers";
import chalk from "chalk";

dbConnect()
    .then(async () => {
        // Sync all models with the database (create tables if they don’t exist)
        await sequelizeInstance.sync(); // Use { force: true } only for development to drop and recreate tables
        console.log(chalk.bgGreenBright.white('\nDatabase tables synchronized !!\n'));

        /** Initalize app with default data after tables are created*/
        await initialize();

        // Start the server
        app.listen(env.PORT, () => {
            console.log(
                `\nServer is running on this url => http://localhost:${env.PORT}\n`
            );
        });
    })
    .catch((err) => {
        console.log("Database Connection FAILED !!:", err);
        process.exit(1);
    });