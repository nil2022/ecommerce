import { dbConnect, sequelizeInstance } from "./config/db.config.js";
import { app } from "./app.js";
import serverPort from "./config/server.config.js";
import { userSchema as User } from "./models/user.model.js";
import { productSchema as Product } from "./models/product.model.js";
import { categorySchema as Category } from "./models/categories.model.js";
import { roleSchema as Role  } from "./models/role.model.js";
import { cartSchema as Cart } from "./models/cart.model.js";
import { Role_User, User_Role } from "./models/association.js";

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
        await sequelizeInstance.sync({ force: true, logging: false });
        
        const defaultRoles = [
            {
                name: "Customer",
            },
            {
                name: "Admin",
            },
            {
                name: "SuperAdmin",
            }
        ];

        const defaultCategories = [
            {
                name: "Beauty",
                description: "All beauty Products",
            },
            {
                name: "Fragnance",
                description: "All Fragnance Products",
            },
            {
                name: "Clothes",
                description: "All types of Clothes",
            },
        ];

        const defaultProducts = [
            {
                description: "Nyka best products",
                name: "MakeUP Kit",
                cost: 870,
                quantity: 20,
                CategoryId: 1,
            },
            {
                description: "Best fragnance",
                name: "Fogg",
                cost: 280,
                quantity: 20,
                CategoryId: 2,
            },
            {
                description: "Best for summer holidays",
                name: "Summer Clothes",
                cost: 1200,
                quantity: 20,
                CategoryId: 3,
            },
        ];

        await Role.bulkCreate(defaultRoles);

        await Category.bulkCreate(defaultCategories)

        await Product.bulkCreate(defaultProducts);

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
        // raw data to be stored in database
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
