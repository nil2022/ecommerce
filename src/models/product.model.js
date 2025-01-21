import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/db.config.js";
import { categorySchema } from "./categories.model.js";
import { cartSchema } from "./cart.model.js";

const productSchema = sequelizeInstance.define("Product", {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    cost: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT("long"),
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // CategoryId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: "Categories",
    //         key: "id"
    //     }
    // } 
})

productSchema.belongsTo(categorySchema, {as : "category", through: "categoryId"})
categorySchema.hasMany(productSchema, {as : "products", foreignKey: "categoryId"});
// categorySchema.hasMany(productSchema, {as : "products", foreignKey: "CategoryId"});
// productSchema.belongsToMany(cartSchema, { through: "CartProducts" });

console.log(await productSchema.sync({alter: true, logging: (msg) => console.log(msg)}));


export { productSchema };