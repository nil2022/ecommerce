// index.js
import { dbConnect, sequelizeInstance } from "./config/db.config.js";
import { app } from "./app.js";
import { userSchema as User } from "./models/user.model.js";
import { productSchema as Product } from "./models/product.model.js";
import { categorySchema as Category } from "./models/categories.model.js";
import { roleSchema as Role } from "./models/role.model.js";
import { cartSchema as Cart } from "./models/cart.model.js";
import env from "#utils/env";

dbConnect()
    .then(async () => {
        // Sync all models with the database (create tables if they don’t exist)
        await sequelizeInstance.sync(); // Use { force: true } only for development to drop and recreate tables
        console.log("Database tables synchronized.");

        // Run initialization logic after tables are created
        await initialize();

        // Start the server
        app.listen(env.PORT, () => {
            console.log(`\nServer is running on this url => http://localhost:${env.PORT}\n`);
        });
    })
    .catch((err) => {
        console.log("Database Connection FAILED !!:", err);
        process.exit(1);
    });

async function initialize() {
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