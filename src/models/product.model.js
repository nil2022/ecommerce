import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/db.config.js";
import { categorySchema } from "./categories.model.js";
import { cartSchema } from "./cart.model.js";

const productSchema = sequelizeInstance.define("Product", {
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    cost: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

// productSchema.belongsTo(categorySchema)
// productSchema.belongsToMany(cartSchema, { through: "CartProducts" });


export { productSchema };