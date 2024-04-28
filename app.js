import express from "express";
import logger from "morgan";

import {
    authRoutes,
    categoryRoutes,
    productRoutes,
    cartRoutes,
} from "./routes/index.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use("/ecomm/api/v1/auth", authRoutes);
app.use("/ecomm/api/v1/category", categoryRoutes);
app.use("/ecomm/api/v1/product", productRoutes);
app.use("/ecomm/api/v1/cart", cartRoutes);

app.use(logger("dev"));

app.get("/", (req, res) => {
    res.status(200).send("Server is up and running");
});

export { app };
