import express from "express";
import { updateCart, getCart } from "../controller/cart.controller.js";
import { verifyToken } from "../middleware/index.js";
const router = express.Router();

router.put("/:id", [verifyToken], updateCart);

router.get("/:id", [verifyToken], getCart);

export default router;
