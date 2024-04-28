import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/db.config.js";
import { productSchema } from "./product.model.js";

const cartSchema = sequelizeInstance.define("Cart", {
    cost: {
        type: DataTypes.INTEGER,
    },
})

// cartSchema.belongsToMany(productSchema, { through: "CartProducts" });


export { cartSchema };