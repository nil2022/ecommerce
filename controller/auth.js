import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel as User, CartModel as Cart } from "../models/index.js";

export async function signUp(req, res) {
    const userId = req.body.userId;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.create({ userId, email, password });
        await Cart.create({
            id: user.id,
        });
        console.log("User Created:", user.userId);
        if (req.body.roles) {
            const roles = req.body.roles;
            const result = await user.setRoles(roles);
            // console.log("user defined roles:", result);
        } else {
            const result = await user.setRoles([1]);
            // console.log("default roles:", result);
        }

        res.send({ msg: "User has been created successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server error" });
    }
}

export async function signIn(req, res) {
    const userId = req.body.userId;
    const password = req.body.password;

    try {
        const user = await User.findOne({
            where: {
                userId: userId,
            },
        });
        if (user) {
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
				console.log('not valid password')
                return res.status(400).send({
                    msg: "Password not correct",
                });
            }

            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });

            const authorities = [];
            const roles = await user.getRoles();
            for (let i = 0; i < roles.length; i++) {
                authorities.push(roles[i].name);
            }

            const finalUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                userId: user.userId,
                accessToken: token,
                authorities: authorities,
            };

            res.send(finalUser);
        } else {
			console.log('hi')
            return res.status(400).send({ msg: "Username/password is not correct" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error", err });
    }
}
