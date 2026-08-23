// AES encryption/decryption utility using Node.js 'crypto' module
// Industry-standard AES-256-CBC

import crypto from "crypto";

const secret_key = process.env.SECRET_KEY || "79SoZnSTsHfVDPYSzxBd5DlGqHpwyBCKJcP1Zl9Qs6A="; // Default secret key for development

/** AES-CBC constants */

// const ALGORITHM = "aes-256-cbc";
// const KEY = crypto.createHash("sha256").update(String(secret_key)).digest(); // 32 bytes
// const IV_LENGTH = 16; // AES block size in bytes

/**
 * Encrypts a string using AES-256-CBC
 * @param {string} plainText - The text to encrypt
 * @returns {string} The encrypted data in base64 format (IV + encrypted)
 */
// export function encrypt(plainText) {
//     const iv = crypto.randomBytes(IV_LENGTH);
//     const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
//     let encrypted = cipher.update(plainText, "utf8", "base64");
//     encrypted += cipher.final("base64");
//     const encryptedData = iv.toString("base64") + ":" + encrypted;
//     return encryptedData;
// }

/**
 * Decrypts a string using AES-256-CBC
 * @param {string} encryptedData - The encrypted data in base64 format (IV + encrypted)
 * @returns {string} The decrypted plain text
 */
// export function decrypt(encryptedData) {
//     const [ivBase64, encrypted] = encryptedData.split(":");
//     const iv = Buffer.from(ivBase64, "base64");
//     const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
//     let decrypted = decipher.update(encrypted, "base64", "utf8");
//     decrypted += decipher.final("utf8");
//     return decrypted;
// }

/** AES-GCM constants */
// AES encryption/decryption utility using Node.js 'crypto' module
// Updated to use AES-256-GCM for enhanced security and data integrity

// Industry-standard AES-256-GCM
// AES-GCM is an authenticated encryption mode that provides both confidentiality and integrity
const ALGORITHM = "aes-256-gcm";
const KEY = crypto.createHash("sha256").update(String(secret_key)).digest(); // 32 bytes
const IV_LENGTH = 12; // Recommended length for GCM
const AUTH_TAG_LENGTH = 16; // GCM auth tag length in bytes

/**
 * Encrypts a string using AES-256-GCM
 * @param {string} plainText - The text to encrypt
 * @returns {string} The encrypted data in base64 format (IV:Encrypted:AuthTag)
 */
export function aesEncrypt(plainText) {
    if(!IV_LENGTH || !ALGORITHM || !KEY) {
        throw new Error("Encryption parameters are not properly set.");
    }
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(plainText, "utf8", "base64");
    encrypted += cipher.final("base64");
    const authTag = cipher.getAuthTag();
    const encryptedData = `${iv.toString("base64")}:${encrypted}:${authTag.toString("base64")}`;
    return encryptedData;
}

/**
 * Decrypts a string using AES-256-GCM
 * @param {string} encryptedData - The encrypted data in base64 format (IV:Encrypted:AuthTag)
 * @returns {string} The decrypted plain text
 */
export function aesDecrypt(encryptedData) {
    if(!ALGORITHM || !KEY || !AUTH_TAG_LENGTH) {
        throw new Error("Decryption parameters are not properly set.");
    }
    const [ivBase64, encrypted, authTagBase64] = encryptedData.split(":");
    const iv = Buffer.from(ivBase64, "base64");
    const authTag = Buffer.from(authTagBase64, "base64");

    if (authTag.length !== AUTH_TAG_LENGTH) {
        throw new Error(`Invalid auth tag length: expected ${AUTH_TAG_LENGTH}, got ${authTag.length}`);
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

const sample_data = "Hello, World!";
const encrypted_data = aesEncrypt(sample_data);
const decrypted_data = aesDecrypt(encrypted_data);
console.log("sample_data: ", sample_data);
console.log("encrypted_data: ", encrypted_data);
console.log("decrypted_data: ", decrypted_data);
