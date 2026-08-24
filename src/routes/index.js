import { Router } from "express";
import authRoutes from "#routes/authRoutes";
import categoryRoutes from "#routes/categoryRoutes";
import productRoutes from "#routes/productRoutes";
import cartRoutes from "#routes/cartRoutes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/category", categoryRoutes);
routes.use("/product", productRoutes);
routes.use("/cart", cartRoutes);

export default routes;
