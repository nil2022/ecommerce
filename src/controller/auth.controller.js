import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel as User, CartModel as Cart } from "../models/index.js";
import supabase from "../utils/supabase.js";

export async function signUp(req, res) {

    const {userId, email, password} = req.body;

    try {
        const user = await User.create({ userId, email, password });
        await Cart.create({
            id: user.id,
        });
        console.log("User Created:", user.userId);
        if (req.body.roles) {
            const roles = req.body.roles;
            await user.setRoles(roles);
            
        } else {
            await user.setRoles([1]);
        }

        res.send({ msg: "User has been created successfully", user });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server error" });
    }
}

export async function signIn(req, res) {
    
    const {userId, password} = req.body

    try {
        const user = await User.findOne({
            where: {
                userId: userId,
            },
        });
        if (user) {
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                console.log("Password not correct");
                return res.status(400).send({
                    msg: "Password not correct",
                });
            }

            const authorities = [];
            const roles = await user.getRoles();
            for (let i = 0; i < roles.length; i++) {
                authorities.push(roles[i].name);
            }

            const accessToken = jwt.sign(
                { 
                    id: user.id,
                    userId: user.userId,
                    email: user.email,
                    authorities
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
                }
            );
            // const refreshToken = jwt.sign(
            //     { 
            //         id: user.id,
            //     },
            //     process.env.ACCESS_TOKEN_SECRET,
            //     {
            //         expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            //     }
            // );

            const finalUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                userId: user.userId,
                authorities: authorities,
            };

            const cookieOptions = {
                http: true,
                secure: true,
            };

            return res
                .status(201)
                .cookie("accessToken", accessToken, cookieOptions)
                .json({
                    data: {
                        sessionData: finalUser,
                        accessToken,
                    },
                    message: "User logged in successfully",
                    statusCode: 200,
                    success: true,
                });
        } else {
            console.log("Username/password is not correct");
            return res
                .status(400)
                .send({ msg: "Username/password is not correct" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error", err });
    }
}
