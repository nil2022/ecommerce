import { cartSchema as Cart } from "./cart.model.js";
import { categorySchema as Category } from "./categories.model.js";
import { productSchema as Product } from "./product.model.js";
import { roleSchema as Role } from "./role.model.js";
import { userSchema as User } from "./user.model.js";

// const User_Role = User.belongsToMany(Role, { through: "UserRoles" });
// const Role_User = Role.belongsToMany(User, { through: "UserRoles" });
const Product_Category = Product.belongsTo(Category, {foreignKey: "CategoryId"})
const Product_Cart = Product.belongsToMany(Cart, { through: "CartProducts" });
const Cart_Product = Cart.belongsToMany(Product,  {through: 'CartProducts'});
const Category_Product = Category.hasMany(Product);

export { User_Role, Role_User, Product_Category, Product_Cart, Cart_Product, Category_Product }