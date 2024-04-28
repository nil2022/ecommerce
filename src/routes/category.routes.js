import express from "express";
import {
    createCategory,
    getAllCategory,
    getCategoryOnId,
    updateCategory,
    deleteCategory,
} from "../controller/category.js";

import {
    checkNameForCategory,
    verifyToken,
    isAdmin,
} from "../middleware/index.js";

const router = express.Router();

router.post(
    "/add",
    [checkNameForCategory, verifyToken, isAdmin],
    createCategory
);

router.get("/getAll", [verifyToken], getAllCategory);

router.get("/getOne", [verifyToken], getCategoryOnId);

router.patch("/updateOne", [verifyToken, isAdmin], updateCategory);

router.delete("/deleteOne", [verifyToken, isAdmin], deleteCategory);

export default router;
