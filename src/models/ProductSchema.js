import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../configs/dbConfig.js";
import Category from "./CategorySchema.js";

const Product = sequelizeInstance.define(
    "Product",
    {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT("long"),
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelizeInstance.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelizeInstance.literal("CURRENT_TIMESTAMP"),
        },
        // CategoryId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: "Categories",
        //         key: "id"
        //     }
        // }
    },
    {
        tableName: "products",
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
    }
);

Product.belongsTo(Category, { as: "category", through: "categoryId" });
Category.hasMany(Product, { as: "products", foreignKey: "categoryId" });
// Category.hasMany(Product, {as : "products", foreignKey: "CategoryId"});
// Product.belongsToMany(cartSchema, { through: "CartProducts" });

// console.log(await Product.sync({alter: true, logging: (msg) => console.log(msg)}));

export default Product;
