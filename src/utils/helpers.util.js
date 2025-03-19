import chalk from "chalk";
import path from "path";
import fs from "fs";
import Role from "#models/RoleSchema";
import Category from "#models/CategorySchema";
import Product from "#models/ProductSchema";
import User from "#models/UserSchema";
import Cart from "#models/CartSchema";
import mysql from "mysql2/promise";
import env from "#utils/env";
import sequelize from "#root/sequelize";

/**Function to store error in error log file */
export const storeError = (error) => {
    try {
        console.log(chalk.redBright(error));
        console.log(error);
        const currentTime = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
        });
        const errorMessage = `${currentTime} - Error: ${error.stack}\n`;

        const logDirectory = path.join(__dirname, "../public", "error");
        const logFilePath = path.join(logDirectory, "error.log");

        // Create the directory if it doesn't exist
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
        }

        // Append to the error log in the public directory
        fs.appendFileSync(logFilePath, errorMessage);

        // Append to a general error log in the root directory
        const generalLogFilePath = path.join(__dirname, "error.log");
        fs.appendFileSync(generalLogFilePath, errorMessage);
    } catch (err) {
        console.error("Error writing to error log:", err);
    }
};

/** New Updated Function */
export const createQueryBuilder = (model, requestBody) => {
    if (!model) {
        throw new Error("Model is undefined or null.");
    }
    requestBody = JSON.parse(JSON.stringify(requestBody));
    const columns = Object.keys(model.rawAttributes);

    const filteredColumns = columns.filter((column) => {
        return (
            requestBody.hasOwnProperty(column) &&
            requestBody[column] !== undefined &&
            requestBody[column] !== "undefined" &&
            requestBody[column] !== null &&
            requestBody[column] !== "null" &&
            // requestBody[column] !== "" && // Exclude empty strings
            !(
                model.rawAttributes[column].allowNull === false &&
                !requestBody[column]
            ) && // Check if required field is missing
            !model.rawAttributes[column].primaryKey &&
            !model.rawAttributes[column].autoIncrement
        );
    });

    const placeholders = Array.from(
        { length: filteredColumns.length },
        () => `?`
    ).join(", ");
    const columnNames = filteredColumns.join(", ");
    const query = `INSERT INTO ${model.tableName}(${columnNames}) VALUES (${placeholders})`;

    const values = filteredColumns.map((column) => {
        const attributeType = model.rawAttributes[column].type;
        if (
            (attributeType instanceof DataTypes.JSON ||
                attributeType instanceof DataTypes.TEXT) &&
            (typeof requestBody[column] === "object" ||
                Array.isArray(requestBody[column]))
        ) {
            return JSON.stringify(requestBody[column]);
        }
        // set null if frontend is sending key value "" empty string
        if (requestBody[column] === "") {
            return null;
        }
        return requestBody[column];
    });

    return {
        query: query,
        values: values,
    };
};

export const updateQueryBuilder = (model, requestBody, customWhere = null) => {
    if (!model) {
        throw new Error("Model is undefined or null.");
    }
    requestBody = JSON.parse(JSON.stringify(requestBody));

    const columns = Object.keys(model.rawAttributes);

    // Identify primary keys and auto increment keys
    const primaryKeyColumns = columns.filter(
        (column) =>
            model.rawAttributes[column].primaryKey ||
            model.rawAttributes[column].autoIncrement
    );

    // Filter columns to update, excluding primary keys, auto increment keys, and the 'created_by' column
    const filteredColumns = columns.filter((column) => {
        return (
            column !== "created_by" && // Exclude the 'created_by' column
            requestBody.hasOwnProperty(column) &&
            requestBody[column] !== undefined &&
            requestBody[column] !== "undefined" &&
            requestBody[column] !== null &&
            requestBody[column] !== "null" &&
            // requestBody[column] !== "" &&
            !model.rawAttributes[column].primaryKey &&
            !model.rawAttributes[column].autoIncrement
        );
    });

    // Generate SET part of the update query
    const setStatements = filteredColumns
        .map((column) => `${column} = ?`)
        .join(", ");

    // Determine columns for the WHERE part of the update query
    const whereColumns =
        customWhere && Object.keys(customWhere).length > 0
            ? Object.keys(customWhere)
            : primaryKeyColumns;

    const whereClauses = whereColumns
        .filter((column) => requestBody.hasOwnProperty(column))
        .map((column) => `${column} = ?`);

    if (whereClauses.length === 0) {
        throw new Error("No columns provided for the WHERE clause.");
    }

    const whereClause = whereClauses.join(" AND ");
    const query = `UPDATE ${model.tableName} SET ${setStatements} WHERE ${whereClause}`;

    const values = filteredColumns.map((column) => {
        const attributeType = model.rawAttributes[column].type;
        if (
            (attributeType instanceof DataTypes.JSON ||
                attributeType instanceof DataTypes.TEXT) &&
            (typeof requestBody[column] === "object" ||
                Array.isArray(requestBody[column]))
        ) {
            return JSON.stringify(requestBody[column]);
        }
        // set null if frontend is sending key value "" empty string
        if (requestBody[column] === "") {
            return null;
        }
        return requestBody[column];
    });

    // Append WHERE clause values to the values array
    if (customWhere) {
        whereColumns.forEach((column) => {
            //   if (customWhere.hasOwnProperty(column)) {
            values.push(customWhere[column]);
            //   }
        });
    } else {
        primaryKeyColumns.forEach((column) => {
            if (requestBody.hasOwnProperty(column)) {
                values.push(requestBody[column]);
            }
        });
    }

    return {
        query: query,
        values: values,
    };
};

/** Initialize with default data when starting app for first time */
export async function initialize() {
    try {
        /** Check for existing Roles in DB */
        const existingRoles = await Role.findAll();
        if (existingRoles.length === 0) {
            const defaultRoles = [
                { name: "Customer" },
                { name: "Admin" },
                { name: "SuperAdmin" },
            ];
            await Role.bulkCreate(defaultRoles);
            console.log("Default roles created.");
        } else {
            console.log("Roles already exist.");
        }

        /** Check for existing Categories in DB */
        const existingCategories = await Category.findAll();
        if (existingCategories.length === 0) {
            const defaultCategories = [
                {
                    name: "Beauty",
                    description: "All beauty Products",
                },
            ];
            await Category.bulkCreate(defaultCategories);
            console.log("Default categories created.");
        } else {
            console.log("Categories already exist.");
        }

        /** Check for existing Products in DB */
        const existingProducts = await Product.findAll();
        if (existingProducts.length === 0) {
            const defaultProducts = [
                {
                    description: "Nyka best products",
                    name: "MakeUP Kit",
                    cost: 870,
                    quantity: 20,
                    CategoryId: 1, // Assumes Category 'Beauty' has ID 1
                },
            ];
            await Product.bulkCreate(defaultProducts);
            console.log("Default products created.");
        } else {
            console.log("Products already exist.");
        }

        /** Fetch or create SYSTEM ADMIN in DB */
        const systemAdmin = await User.findOne({
            where: { userId: process.env.SYSTEM_ADMIN_USERID },
        });

        if (systemAdmin) {
            console.log("\nWELCOME SYSTEM ADMINISTRATOR!\n");
            return;
        }

        // Create SYSTEM ADMIN if it doesn’t exist
        const createSystemAdmin = await User.create({
            userId: process.env.SYSTEM_ADMIN_USERID,
            password: process.env.SYSTEM_ADMIN_PASSWORD,
            email: process.env.SYSTEM_ADMIN_EMAIL,
        });
        await createSystemAdmin.setRoles([3]); // Assumes SuperAdmin has ID 3
        await Cart.create({ id: createSystemAdmin.id });
        console.log("\nSYSTEM ADMINISTRATOR created and initialized!\n");
    } catch (err) {
        console.error("Initialization failed:", err);
        throw err; // Rethrow to catch in the outer promise chain
    }
}

/** Function to check and create database if it doesn't exist using mysql2 */
export async function createDatabaseIfNotExists() {
    // Create a raw MySQL connection without specifying a database
    const connection = await mysql.createConnection({
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        port: env.DB_PORT,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    try {
        // Check if the database exists by querying the list of databases
        const [rows] = await connection.query(
            `SHOW DATABASES LIKE '${env.DB_NAME}';`
        );

        if (rows.length === 0) {
            // Database doesn’t exist, so create it
            await connection.query(`CREATE DATABASE \`${env.DB_NAME}\`;`);
            console.log(`Database '${env.DB_NAME}' created.`);
            await sequelize.sync(); // Sync all models with the database
            console.log(
                chalk.bgGreenBright.white("\nDatabase tables synchronized !!\n")
            );
        } else {
            console.log(
                chalk.bgYellowBright.bold(
                    `Database '${env.DB_NAME}' already exists.`
                )
            );
        }
    } catch (error) {
        console.error("Error checking/creating database:", error);
        throw error;
    } finally {
        // Close the raw MySQL connection
        await connection.end();
    }
}
