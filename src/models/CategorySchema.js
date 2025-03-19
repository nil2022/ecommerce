import { DataTypes } from "sequelize";
import sequelize from "#root/sequelize";

const Category = sequelize.define(
    "Categories",
    {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT("long"),
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        },
    },
    {
        tableName: "categories",
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
    }
);

// console.log(await categorySchema.sync({alter: true, logging: (msg) => console.log(msg)}));

export default Category;
