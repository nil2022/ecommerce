import chalk from "chalk";
import Category from "#models/CategorySchema";

const log = console.log;

export async function validateProductData(req, res, next) {
    const productData = req.body;

    try {
        if (!productData.name) {
            res.status(400).send({ msg: "name is missing in product data" });
            return;
        }
        if (productData.CategoryId) {
            const result = await Category.findByPk(productData.CategoryId);
            if (result) {
                next();
            } else {
                res.status(400).send({
                    msg: "CategoryID does not exist in category table",
                });
                return;
            }
        } else {
            res.status(400).send({ msg: "CategoryID is missing in product data" });
            return;
        }
    } catch (error) {
        log(chalk.redBright.bgRed(error.name + ": " + error.message));
        return res.status(500).send({ msg: "Internal server error" });
    }
}
