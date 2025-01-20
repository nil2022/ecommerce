import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/db.config.js";
import { userSchema } from "./user.model.js";
import chalk from "chalk";

const roleSchema = sequelizeInstance.define("Role", {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
})

roleSchema.belongsToMany(userSchema, { as: "users", through: "UserRoles" });
userSchema.belongsToMany(roleSchema, { as: "roles", through: "UserRoles" });

// console.log(await roleSchema.sync({alter: true, logging: (msg) => console.log(chalk.magenta(msg))}));


export { roleSchema };