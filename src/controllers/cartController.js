import Cart from "../models/CartSchema.js";
import Product from "../models/ProductSchema.js";

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
                await Cart.update(
                    { cost: totalCost },
                    { where: { id: cartId } }
                );
                return res.send({ totalCost, addedProduct });
            } else {
                console.log("Product does not exist");
                return res.status(400).send({ msg: "Product does not exist" });
            }
        } else {
            console.log("Cart does not exist");
            return res.status(400).send({ msg: "Cart does not exist" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal server error" });
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
            return res.send({ totalCost, addedProduct });
        } else {
            console.log("Cart does not exist");
            return res.status(400).send({ msg: "Cart does not exist" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal server error", err });
    }
}
