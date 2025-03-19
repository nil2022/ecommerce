import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import helmet from "helmet";

import routes from "#routes/routes";
import sendResponse from "#utils/response";

const app = express();

// app.use(logger("dev"));
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
    credentials: true
}))

app.use("/api", routes);

app.get("/", (req, res) => {
    return sendResponse(res, 200, null, "Backend is running 🚀");
});

// Route not found middleware
app.use("*", (req, res) => {
    console.log("Route not found !");
    return sendResponse(res, 404, null, "Route not found");
});


export default app;
