import chalk from "chalk";
import { ProductModel as Products } from "../models/index.js";
import { Op } from "sequelize";

const log = console.log;

export async function createProduct(req, res) {
    const productData = req.body;

    try {
        const name = productData.name;
        const description = productData.description;
        const cost = productData.cost;
        const quantity = productData.quantity;
        const categoryId = productData.CategoryId;

        const result = await Products.create({
            name,
            description,
            cost,
            quantity,
            categoryId,
        });
        return res.status(200).send({ msg: "Product got created", result });
    } catch (err) {
		log(chalk.redBright.bgRed(err.name + ": " + err.message));
        return res.status(500).send({ msg: "Internal server error"});
    }
}

export async function getAllProduct(req, res) {
    try {
        const result = await Products.findAll();
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send({ msg: "Internal server error", err });
    }
}

export async function getProductOnId(req, res) {
    const productId = req.query.id;

    try {
        const result = await Products.findOne({
            where: {
                id: productId,
            },
        });
        if (result == null) {
            res.status(400).send({ msg: "product id does not exist" });
            return;
        }
        res.send(result);
    } catch (err) {
        res.status(500).send({ msg: "Internal server error", err });
    }
}

export async function updateProduct(req, res) {
    const productData = req.body;
    const productId = req.query.id;

    if (
        !(
            productData.name &&
            productData.cost &&
            productData.quantity &&
            productData.description
        )
    ) {
        res.status(400).send({
            msg: "Name, Cost, Quantity & description is missing",
        });
        return;
    }

    try {
        const name = productData.name;
        const description = productData.description;
        const cost = productData.cost;
        const quantity = productData.quantity;

        const product = await Products.findOne({
            where: { id: productId },
        });

        if (product) {
            product.name = name;
            product.cost = cost;
            product.description = description;
            product.quantity = quantity;

            product.save();

            res.send({ msg: "product got updated successfully" });
        } else {
            res.status(400).send({ msg: "product id does not exist" });
        }
    } catch (err) {
        console.log("err", err);
        res.status(500).send({ msg: "Internal server error", err });
    }
}

/**
 * Deletes a product from the database.
 */
export async function deleteProduct(req, res) {
    const productId = req.query.id;
    try {
        const getProduct = await Products.destroy({
            where: { id: productId },
        });
        if (!getProduct) {
            return res.status(400).send({ msg: "product id does not exist" });
        }
        return res.send({ msg: "product delete successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal server error" });
    }
}

export async function filterBasedOnProduct(req, res) {
    /** CHECK CategoryId for crash problem**/
    const CategoryId = req.query.CategoryId; // ?CategoryId=3
    /** CHECK name for crash problem**/
    const name = req.query.name; // ?name=
    const minCost = req.query.minCost; // ?minCost=450
    const maxCost = req.query.maxCost; // ?maxCost=350

    if (CategoryId) {
        const result = await Products.findAll({
            where: {
                CategoryId: CategoryId,
            },
        });
        res.send(result);
    }
    if (name) {
        const result = await Products.findAll({
            where: {
                name: name,
            },
        });
        res.send(result);
    }
    if (minCost && maxCost) {
        const result = await Products.findAll({
            where: {
                cost: {
                    [Op.gte]: minCost,
                    [Op.lte]: maxCost,
                },
            },
        });

        res.send(result);
    } else if (minCost) {
        const result = await Products.findAll({
            where: {
                cost: {
                    [Op.gte]: minCost,
                },
            },
        });

        res.send(result);
    } else if (maxCost) {
        const result = await Products.findAll({
            where: {
                cost: {
                    [Op.lte]: maxCost,
                },
            },
        });

        res.send(result);
    } else {
        const result = await Products.findAll();
        res.send(result);
    }
}
