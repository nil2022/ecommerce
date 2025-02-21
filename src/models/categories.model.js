import { DataTypes } from "sequelize";
import { sequelizeInstance } from "../config/db.config.js";
// import { productSchema } from "./product.model.js";

const categorySchema = sequelizeInstance.define("Categories", {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT("long"),
    },
})

// console.log(await categorySchema.sync({alter: true, logging: (msg) => console.log(msg)}));


export { categorySchema };