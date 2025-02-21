// utils/env.js
import { cleanEnv, str, num, url } from "envalid";

const env = cleanEnv(process.env, {
    // General
    PORT: num({ default: 9000, desc: "Application port" }),
    NODE_ENV: str({
        default: "dev",
        choices: ["dev", "prod", "test"],
        desc: "Node environment",
    }),

    // CORS Options
    CORS_ORIGIN: str({ default: "", desc: "CORS origin (empty for no CORS)" }),
    CORS_ALLOWED_HEADERS: str({
        default: "",
        desc: "CORS allowed headers (comma-separated)",
    }),

    // Secret Key
    ACCESS_TOKEN_SECRET: str({ default: "secret", desc: "Access token secret" }),
    ACCESS_TOKEN_EXPIRY: str({
        default: "7d",
        desc: "Access token expiry duration",
    }),

    // Database
    DB_HOST: str({ default: "localhost", desc: "Database host" }),
    DB_USER: str({ default: "root", desc: "Database username" }),
    DB_PASSWORD: str({ default: "root", desc: "Database password" }),
    DB_NAME: str({ default: "ecomm", desc: "Database name" }),
    DB_PORT: num({ default: 3306, desc: "Database port" }),

    // System Admin Credentials
    SYSTEM_ADMIN_USERID: str({ default: "john", desc: "System admin user ID" }),
    SYSTEM_ADMIN_PASSWORD: str({
        default: "12345678",
        desc: "System admin password",
    }),
    SYSTEM_ADMIN_EMAIL: str({ desc: "System admin email" }),
});

// Export the validated environment variables
export default env;