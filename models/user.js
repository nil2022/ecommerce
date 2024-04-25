"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * This method is used to define associations between Sequelize models.
         * It is called automatically by the `models/index` file.
         */
        static associate(models) {
            // Define the association between the User model and the Role model
            // using the `belongsToMany` method with the intermediate model 'UserRoles'
            User.belongsToMany(models.Role, { through: "UserRoles" });
        }
    }
    User.init(
        {
            username: DataTypes.TEXT,
            email: DataTypes.TEXT,
            password: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
