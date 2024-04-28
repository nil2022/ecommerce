import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/db.config.js";
import { productSchema } from "./product.model.js";

const categorySchema = sequelizeInstance.define("Categories", {
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
})

// categorySchema.hasMany(productSchema);


export { categorySchema };