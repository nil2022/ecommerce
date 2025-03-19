import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "#root/sequelize";
import chalk from "chalk";

const User = sequelize.define(
    "User",
    {
        userId: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            /** HASH THE INCOMING PASSWORD BEFORE SAVE */
            set(value) {
                this.setDataValue("password", bcrypt.hashSync(value, 10));
            },
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
        tableName: "users",
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
    }
);

// User.belongsToMany(roleSchema, { as: "roles", through: "UserRoles" });

// console.log(
//     await User.sync({
//         alter: true,
//         logging: (msg) => console.log(chalk.blue(msg)),
//     })
// );

export default User;
