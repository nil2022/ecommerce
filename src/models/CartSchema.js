import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../configs/dbConfig.js";
import Product from "./ProductSchema.js";

const Cart = sequelizeInstance.define(
    "Cart",
    {
        cost: {
            type: DataTypes.INTEGER,
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
    },
    {
        tableName: "carts",
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
    }
);

Cart.belongsToMany(Product, {
    as: "products",
    through: {
        model: "cartProducts",
        timestamps: false,
        created_at: {
            type: DataTypes.DATE,
            defaultValue: sequelizeInstance.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: sequelizeInstance.literal("CURRENT_TIMESTAMP"),
        },
    },
    foreignKey: "cartId",
    foreignKeyConstraint: true,
});
Product.belongsToMany(Cart, {
    as: "carts",
    through: {
        model: "cartProducts",
        timestamps: false,
        created_at: {
            type: DataTypes.DATE,
            defaultValue: sequelizeInstance.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: sequelizeInstance.literal("CURRENT_TIMESTAMP"),
        },
    },
    foreignKey: "productId",
    foreignKeyConstraint: true,
});

// console.log(await Cart.sync({alter: true, logging: (msg) => console.log(msg)}));

export default Cart;
