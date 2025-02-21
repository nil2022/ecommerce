import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { sequelizeInstance } from "../config/db.config.js";
// import { roleSchema } from "./role.model.js";
import chalk from "chalk";

const userSchema = sequelizeInstance.define("User", {
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
        }
    },
    // isAdmin: {
    //     type: DataTypes.BOOLEAN,
    //     defaultValue: false
    // }
})

// userSchema.belongsToMany(roleSchema, { as: "roles", through: "UserRoles" });

// console.log(await userSchema.sync({alter: true, logging: (msg) => console.log(chalk.blue(msg))}));


export { userSchema };

