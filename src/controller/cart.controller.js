import {
    CartModel as Cart,
    ProductModel as Products,
} from "../models/index.js";

export async function updateCart(req, res) {
    const cartId = req.params.id;
    try {
        const cart = await Cart.findByPk(cartId);
        if (cart) {
            const productIds = req.body.productIds;
            const alreadyAddedProducts = await cart.getProducts();
            const products = await Products.findAll({
                where: {
                    id: productIds,
                },
            });

            if (products.length > 0) {
                await cart.setProducts([...products, ...alreadyAddedProducts]);

                const cartProducts = await cart.getProducts();

                let totalCost = 0;
                const addedProducts = [];

                for (let i = 0; i < cartProducts.length; i++) {
                    totalCost = totalCost + cartProducts[i].dataValues.cost;

                    addedProducts.push({
                        id: cartProducts[i].dataValues.id,
                        name: cartProducts[i].dataValues.name,
                        cost: cartProducts[i].dataValues.cost,
                        description: cartProducts[i].dataValues.description,
                    });
                }
                await Cart.update(
                    { cost: totalCost },
                    { where: { id: cartId } }
                );
                return res.send({ totalCost, addedProducts });
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
            const cartProducts = await cart.getProducts();

            let totalCost = 0;
            const addedProducts = [];

            for (let i = 0; i < cartProducts.length; i++) {
                totalCost = totalCost + cartProducts[i].dataValues.cost;

                addedProducts.push({
                    id: cartProducts[i].dataValues.id,
                    name: cartProducts[i].dataValues.name,
                    cost: cartProducts[i].dataValues.cost,
                    description: cartProducts[i].dataValues.description,
                });
            }
            return res.send({ totalCost, addedProducts });
        } else {
            console.log("Cart does not exist");
            return res.status(400).send({ msg: "Cart does not exist" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "Internal server error", err });
    }
}
