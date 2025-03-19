import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../configs/dbConfig.js";
import chalk from "chalk";
import User from "./UserSchema.js";

const Role = sequelizeInstance.define(
    "Role",
    {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
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
        tableName: "roles",
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
    }
);

Role.belongsToMany(User, {
    as: "users",
    through: {
        model: "userRoles",
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
    foreignKey: "roleId",
    foreignKeyConstraint: true,
});
User.belongsToMany(Role, {
    as: "roles",
    through: {
        model: "userRoles",
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
    foreignKey: "userId",
    foreignKeyConstraint: true,
});

// console.log(await Role.sync({alter: true, logging: (msg) => console.log(chalk.magenta(msg))}));

export default Role;
