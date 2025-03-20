import Cart from "#models/CartSchema";
import Product from "#models/ProductSchema";
import sendResponse from "#utils/response";

export async function updateCart(req, res) {
    const cartId = req.params.id;
    try {
        const cart = await Cart.findByPk(cartId);
        if (cart) {
            const productIds = req.body.productIds;
            const alreadyAddedProduct = await cart.getProduct();
            const products = await Product.findAll({
                where: {
                    id: productIds,
                },
            });

            if (products.length > 0) {
                await cart.setProduct([...products, ...alreadyAddedProduct]);

                const cartProduct = await cart.getProduct();

                let totalCost = 0;
                const addedProduct = [];

                for (let i = 0; i < cartProduct.length; i++) {
                    totalCost = totalCost + cartProduct[i].dataValues.cost;

                    addedProduct.push({
                        id: cartProduct[i].dataValues.id,
                        name: cartProduct[i].dataValues.name,
                        cost: cartProduct[i].dataValues.cost,
                        description: cartProduct[i].dataValues.description,
                    });
                }
                await Cart.update({ cost: totalCost }, { where: { id: cartId } });
                return sendResponse(res, 200, { totalCost, addedProduct }, "Cart updated successfully");
            } else {
                return sendResponse(res, 400, null, "Product does not exist");
            }
        } else {
            return sendResponse(res, 400, null, "Cart does not exist");
        }
    } catch (error) {
        return sendResponse(res, 500, null, "Internal server error");
    }
}

export async function getCart(req, res) {
    const cartId = req.params.id;
    try {
        const cart = await Cart.findByPk(cartId);

        if (cart) {
            const cartProduct = await cart.getProduct();

            let totalCost = 0;
            const addedProduct = [];

            for (let i = 0; i < cartProduct.length; i++) {
                totalCost = totalCost + cartProduct[i].dataValues.cost;

                addedProduct.push({
                    id: cartProduct[i].dataValues.id,
                    name: cartProduct[i].dataValues.name,
                    cost: cartProduct[i].dataValues.cost,
                    description: cartProduct[i].dataValues.description,
                });
            }
            return sendResponse(res, 200, { totalCost, addedProduct }, "Cart fetched successfully");
        } else {
            return sendResponse(res, 400, null, "Cart does not exist");
        }
    } catch (error) {
        return sendResponse(res, 500, null, "Internal server error");
    }
}
