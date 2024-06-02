import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { sequelizeInstance } from "../config/db.config.js";

const userSchema = sequelizeInstance.define("User", {
    userId: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
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

// const User_Role = userSchema.belongsToMany(roleSchema, { through: "UserRoles" });


export { userSchema };

