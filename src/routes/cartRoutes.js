import express from "express";
import { updateCart, getCart } from "#controllers/cartController";
import { verifyToken } from "#middlewares/authjwt";

const cartRouter = express.Router();

cartRouter.put("/:id", [verifyToken], updateCart);

cartRouter.get("/:id", [verifyToken], getCart);

export default cartRouter;
