import chalk from "chalk";
import Category from "#models/CategorySchema";
import sendResponse from "#utils/response";

const log = console.log;

export async function validateProductData(req, res, next) {
    const { name, CategoryId } = req.body;

    try {
        if (!name) {
            return sendResponse(res, 400, null, "Name is missing in product data");
        }

        if (!CategoryId) {
            return sendResponse(res, 400, null, "CategoryID is missing in product data");
        }

        const category = await Category.findByPk(CategoryId);
        if (!category) {
            return sendResponse(res, 400, null, "CategoryID does not exist in category table");
        }

        next();
    } catch (error) {
        log(chalk.redBright.bgRed(error.name + ": " + error.message));
        return sendResponse(res, 500, null, "Internal server error");
    }
}
