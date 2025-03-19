import { createClient } from "redis";
import env from '#utils/env';

// Redis connection configuration
const redisConfig = {
    url: env.REDIS_URL,
    socket: {
        tls: true,
        rejectUnauthorized: false, // For self-signed certificates
        connectTimeout: 5000, // 5 seconds
        reconnectStrategy: (retries) => Math.min(retries * 100, 3000)
    },
};

// Singleton Redis client and connection promise
let client = null;
let connectionPromise = null;

/**
 * Creates Redis client and manages connection
 */
async function getRedisClient() {
    if (!client) {
        client = createClient(redisConfig);

        // Setup error handler
        client.on("error", (err) => {
            console.error("Redis client error:", err);
        });

        // Connect only once
        if (!connectionPromise) {
            connectionPromise = client.connect();
        }
    }

    try {
        await connectionPromise;
        return client;
    } catch (err) {
        console.error("Redis connection failed:", err);
        connectionPromise = null; // Reset connection promise to allow retries
        throw err;
    }
}

/**
 * Stores data in Redis with optional expiration
 * @param {string} key - Key to store
 * @param {string|object} value - Value to store
 * @param {object} [options] - Redis SET options
 * @returns {Promise<boolean>} True if successful
 */
export async function setData(key, value, options = {}) {
    try {
        const client = await getRedisClient();
        const serializedValue =
            typeof value === "object" ? JSON.stringify(value) : value;

        await client.set(key, serializedValue, options);
        // Alternative options:
        // - EX: Expiration in seconds
        // - NX: Only set if key doesn't exist
        // - PX: Expiration in milliseconds
        // - XX: Only set if key exists
        // - KEEPTTL: Preserve existing TTL
        return true;
    } catch (error) {
        console.error("Error setting data:", error);
        throw error;
    }
}

/**
 * Retrieves data from Redis
 * @param {string} key - Key to retrieve
 * @returns {Promise<string|object|null>} Stored value or null
 */
export async function getData(key) {
    try {
        const client = await getRedisClient();
        const data = await client.get(key);

        if (!data) return null;

        // Attempt JSON parse for objects
        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    } catch (error) {
        console.error("Error getting data:", error);
        throw error;
    }
}

/**
 * Example usage:
 *
 * * Store data with 1 hour expiration
 * await setData('user:123', { name: 'Alice' }, { EX: 3600 });
 *
 * // Retrieve data
 * const user = await getData('user:123');
 * console.log(user); // { name: 'Alice' }
 *
 * // Store simple string
 * await setData('status', 'active');
 *
 * // Get string value
 * const status = await getData('status');
 * console.log(status); // 'active'
 */
