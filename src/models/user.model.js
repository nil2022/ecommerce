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
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            isEmail: true,
            // is: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
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

