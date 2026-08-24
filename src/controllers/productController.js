import chalk from "chalk";
import Product from "#models/ProductSchema";
import { Op } from "sequelize";
import sendResponse from "#utils/response";

export async function createProduct(req, res) {
    const productData = req.body;

    try {
        const name = productData.name;
        const description = productData.description;
        const cost = productData.cost;
        const quantity = productData.quantity;
        const categoryId = productData.CategoryId;

        const result = await Product.create({
            name,
            description,
            cost,
            quantity,
            categoryId,
        });
        return sendResponse(res, 200, result, "Product got created");
    } catch (error) {
        return sendResponse(res, 500, error, "Internal server error");
    }
}

export async function getAllProduct(req, res) {
    try {
        const result = await Product.findAll();
        return sendResponse(res, 200, result, "All products");
    } catch (error) {
        return sendResponse(res, 500, error, "Internal server error");
    }
}

export async function getProductOnId(req, res) {
    const productId = req.query.id;

    try {
        const result = await Product.findOne({
            where: {
                id: productId,
            },
        });
        if (result == null) {
            return sendResponse(res, 400, null, "Product id does not exist");
        }
        return sendResponse(res, 200, result, "Product fetched successfully");
    } catch (error) {
        return sendResponse(res, 500, error, "Internal server error");
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
        return sendResponse(res, 400, null, "Please provide all the fields");
    }

    try {
        const name = productData.name;
        const description = productData.description;
        const cost = productData.cost;
        const quantity = productData.quantity;

        const product = await Product.findOne({
            where: { id: productId },
        });

        if (product) {
            product.name = name;
            product.cost = cost;
            product.description = description;
            product.quantity = quantity;

            product.save();

            return sendResponse(
                res,
                200,
                product,
                "Product updated successfully"
            );
        } else {
            return sendResponse(res, 400, null, "Product id does not exist");
        }
    } catch (error) {
        return sendResponse(res, 500, error, "Internal server error");
    }
}

/**
 * Deletes a product from the database.
 */
export async function deleteProduct(req, res) {
    const productId = req.query.id;
    try {
        const getProduct = await Product.destroy({
            where: { id: productId },
        });
        if (!getProduct) {
            return sendResponse(res, 400, null, "Product id does not exist");
        }
        return sendResponse(res, 200, null, "Product deleted successfully");
    } catch (error) {
        return sendResponse(res, 500, error,"Internal server error");
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
        const result = await Product.findAll({
            where: {
                CategoryId: CategoryId,
            },
        });
        return sendResponse(res, 200, result, "Data fetched successfully");
    }
    if (name) {
        const result = await Product.findAll({
            where: {
                name: name,
            },
        });
        return sendResponse(res, 200, result, "Data fetched successfully");
    }
    if (minCost && maxCost) {
        const result = await Product.findAll({
            where: {
                cost: {
                    [Op.gte]: minCost,
                    [Op.lte]: maxCost,
                },
            },
        });

        return sendResponse(res, 200, result, "Data fetched successfully");
    } else if (minCost) {
        const result = await Product.findAll({
            where: {
                cost: {
                    [Op.gte]: minCost,
                },
            },
        });

        return sendResponse(res, 200, result, "Data fetched successfully");
    } else if (maxCost) {
        const result = await Product.findAll({
            where: {
                cost: {
                    [Op.lte]: maxCost,
                },
            },
        });

        return sendResponse(res, 200, result, "Data fetched successfully");
    } else {
        const result = await Product.findAll();
        return sendResponse(res, 200, result, "Data fetched successfully");
    }
}
