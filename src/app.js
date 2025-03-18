import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import helmet from "helmet";

import routes from "#routes/routes";

const app = express();

// app.use(logger("dev"));
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
    credentials: true
}))

app.use("/api", routes);

app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Backend is running 🚀",
        route: "/",
        statusCode: 200,
        success: true,
    });
});

// Route not found middleware
app.use("*", (req, res) => {
    console.log("Route not found !");
    res.status(404).json({
        message: "Route not found",
        route: req.originalUrl,
        statusCode: 404,
        success: false,
    });
});


export { app };
