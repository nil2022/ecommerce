import express from "express";
import logger from "morgan";
import cors from 'cors';
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

app.use(logger("dev"));
app.use(helmet());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
    credentials: true
}))

import {
    authRoutes,
    categoryRoutes,
    productRoutes,
    cartRoutes,
} from "./routes/index.js";

app.use("/ecomm/api/v1/auth", authRoutes);
app.use("/ecomm/api/v1/category", categoryRoutes);
app.use("/ecomm/api/v1/product", productRoutes);
app.use("/ecomm/api/v1/cart", cartRoutes);

app.use(cookieParser());

app.get("/health", (req, res) => {
    res.status(200).send("Server is up and running 🚀");
});

// Route not found middleware
app.use("*", (_, res) => {
    console.log("Route not found !");
    res.status(404).json({
        message: "Route not found",
        route: req.originalUrl,
        statusCode: 404,
        success: false,
    });
});


export { app };
