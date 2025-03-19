import express from "express";
import {
    createCategory,
    getAllCategory,
    getCategoryOnId,
    updateCategory,
    deleteCategory,
} from "#controllers/categoryController";

import { checkNameForCategory } from "#middlewares/category";
import { verifyToken, isAdmin } from "#middlewares/authjwt";

const categoryRouter = express.Router();

categoryRouter.post(
    "/add",
    [checkNameForCategory, verifyToken, isAdmin],
    createCategory
);

categoryRouter.get("/getAll", [verifyToken], getAllCategory);

categoryRouter.get("/getOne", [verifyToken], getCategoryOnId);

categoryRouter.patch("/updateOne", [verifyToken, isAdmin], updateCategory);

categoryRouter.delete("/deleteOne", [verifyToken, isAdmin], deleteCategory);

export default categoryRouter;
