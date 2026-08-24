import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import logger from "morgan";
// import helmet from "helmet";

import routes from "#routes/index";
import sendResponse from "#utils/response";

const app = express();

app.use(logger("dev"));
// app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
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
    return sendResponse(res, 404, null, "Route not found");
});


export default app;
