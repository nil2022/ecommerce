import { dbConnect, sequelizeInstance } from "./config/db.config.js";
import { app } from "./app.js";
import serverPort from "./config/server.config.js";
import { userSchema as User } from "./models/user.model.js";
import { productSchema as Product } from "./models/product.model.js";
import { categorySchema as Category } from "./models/categories.model.js";
import { roleSchema as Role } from "./models/role.model.js";
import { cartSchema as Cart } from "./models/cart.model.js";
import { Role_User, User_Role } from "./models/association.js";
import { booleanValue } from "./utils/constants.js";

dbConnect()
    .then(() => {
        initialize();
        app.listen(serverPort, () => {
            console.log(`\nServer is running on this port: ${serverPort}\n`);
        });
    })
    .catch((err) => {
        console.log("Database Connection FAILED !!:", err);
    });
async function initialize() {
    try {
        await sequelizeInstance.sync({
            /** WARNING -> (force = true) WILL DELETE ALL DATA FROM DATABASE, USE WITH CAUTION, <- WARINING */
            force:
                process.env.SEQUELIZE_FORCE_STATUS === "true"
                    ? booleanValue.TRUE_VALUE
                    : booleanValue.FALSE_VALUE,
            logging:
                process.env.SEQUELIZE_LOGGING_STATUS === "true"
                    ? booleanValue.TRUE_VALUE
                    : booleanValue.FALSE_VALUE,
        });

        /** Check for existing Roles in DB */
        const existingRoles = await Role.findAll();
        // console.log(existingRoles);
        if (!(existingRoles.length > 0)) {
            const defaultRoles = [
                {
                    name: "Customer",
                },
                {
                    name: "Admin",
                },
                {
                    name: "SuperAdmin",
                },
            ];
            await Role.bulkCreate(defaultRoles);
        }

        /** Check for exisitng Categories in DB */
        const existingCategories = await Category.findAll();
        if (!(existingCategories.length > 0)) {
            const defaultCategories = [
                {
                    name: "Beauty",
                    description: "All beauty Products",
                },
            ];
            await Category.bulkCreate(defaultCategories);
        }

        /** Check for existing Products in DB */
        const existingProducts = await Product.findAll();
        if (!(existingProducts.length > 0)) {
            const defaultProducts = [
                {
                    description: "Nyka best products",
                    name: "MakeUP Kit",
                    cost: 870,
                    quantity: 20,
                    CategoryId: 1,
                },
            ];
            await Product.bulkCreate(defaultProducts);
        }
        /** Fetch SYSTEM ADMIN in DB */
        const systemAdmin = await User.findOne({
            where: {
                userId: process.env.SYSTEM_ADMIN_USERID,
            },
        });
        // console.log("systemAdmin", systemAdmin);
        if (systemAdmin) {
            console.log("\nWELCOME SYSTEM ADMINISTRATOR!\n");
            return;
        }
        // Create a SYSTEM ADMIN if does not exists !
        const createSystemAdmin = await User.create({
            userId: process.env.SYSTEM_ADMIN_USERID,
            password: process.env.SYSTEM_ADMIN_PASSWORD,
            email: process.env.SYSTEM_ADMIN_EMAIL,
        });
        await createSystemAdmin.setRoles([3]);
        await Cart.create({
            id: createSystemAdmin.id,
        });
        console.log("\nWELCOME SYSTEM ADMINISTRATOR!\n");
    } catch (err) {
        console.log(err);
    }
}
