import { Sequelize } from "sequelize"; // Use mysql2/promise for async/await
import env from "#utils/env"; // Adjust path based on your structure

// Define database configuration for Sequelize
const config = {
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
    database: env.DB_NAME,
};

// Build dialect options. SSL is only requested when explicitly enabled via
// DB_SSL, otherwise Sequelize/mysql2 must not ask for a secure connection
// (local XAMPP MySQL has no SSL support and rejects it with
// HANDSHAKE_NO_SSL_SUPPORT).
const dialectOptions = env.DB_SSL
    ? {
          ssl: {
              require: true,
              rejectUnauthorized: false,
          },
      }
    : {};

// Create the main Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: "mysql",
    logging: false,
    dialectOptions,
});

export default sequelize;