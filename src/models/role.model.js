import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/db.config.js";

const roleSchema = sequelizeInstance.define("Role", {
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
})

// const Role_User = roleSchema.belongsToMany(userSchema, { through: "UserRoles" });


export { roleSchema };