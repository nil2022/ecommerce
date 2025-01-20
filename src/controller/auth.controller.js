import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel as User, CartModel as Cart } from "../models/index.js";
import * as Yup from "yup";
import { Op } from "sequelize";
import { roleSchema } from "../models/role.model.js";
// import supabase from "../utils/supabase.js";

export async function signUp(req, res) {
    const { userId, email, password, roles } = req.body;

    // Define the custom regex pattern
    const emailPattern = /^[a-zA-Z0-9._%-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/;

    try {
        let userSchema = Yup.object().shape({
            userId: Yup.string().required("UserId is required"),
            email: Yup.string()
                .required("Email is required")
                .matches(emailPattern, "Invalid Email format"),
            password: Yup.string()
                .required("Password is required")
                .min(6, "Password must be at least 6 characters"),
        });

        await userSchema.validate({
            userId,
            email,
            password,
        });

        /** CHECK FOR EXISTING USER USING USERID OR EMAIL IN DATABASE */
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ userId: userId }, { email: email }],
            },
            // include: [
            //     {
            //         model: roleSchema,
            //         as: "roles",
            //         required: false,
            //     },
            // ],
        });
        // console.log('Existing User:', existingUser)
        if (existingUser) {
            console.table({
                message: "UserId or Email already exist",
            });
            return res.status(400).send({
                success: false,
                message: "UserId or Email already exist",
                statusCode: 400,
            });
        }

        const user = await User.create({ userId, email, password });
        await Cart.create({
            id: user.id,
        });

        console.log({ "User Created:": user.userId });

        if (roles) {
            await user.setRoles(roles);
        } else {
            await user.setRoles([1]);
        }

        res.json({
            user,
            success: true,
            message: "User has been created successfully",
            statusCode: 200,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: `${err.name}: ${err.message}`,
            statusCode: 500,
        });
    }
}

export async function signIn(req, res) {
    const { userId, password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                userId: userId,
            },
            // where: {
            //     [Op.or]: [{ userId: userId }],
            // },
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
            // console.log("roles:", roles);
            authorities.push({
                id: roles[0].dataValues.id,
                name: roles[0].dataValues.name,
            });

            const accessToken = jwt.sign(
                {
                    id: user.id,
                    userId: user.userId,
                    email: user.email,
                    authorities,
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
                        sessionUser: finalUser,
                        accessToken,
                    },
                    message: "User logged in successfully",
                    statusCode: 200,
                    success: true,
                });
        } else {
            console.log({ message: "User not found in database" });
            return res.status(400).json({
                success: false,
                message: "User not found in database",
                statusCode: 400,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            statusCode: 500,
            err,
        });
    }
}

export async function logout(req, res) {
    const cookieOptions = {
        http: true,
        secure: true,
    };
    return res.status(200).clearCookie("accessToken", "", cookieOptions).json({
        msg: "User logged out successfully",
        statusCode: 200,
        success: true,
    });
}

export async function fetchAllUsers(req, res) {
    try {
        // console.log("req.user", req.user);
        if (!(req.user.authorities[0].name === "SuperAdmin")) {
            return res.status(400).send({
                success: false,
                message: "Access Denied",
                statusCode: 400,
            });
        }
        const users = await User.findAll();

        for (let i = 0; i < users.length; i++) {
            const userRoles = await users[i].getRoles();
            users[i].userType = userRoles[0].dataValues.name;
        }

        const userObject = users.map((user) => {
            return {
                id: user.id,
                userId: user.userId,
                email: user.email,
                userType: user.userType
                    ? user.userType
                    : "UserType not defined",
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        });

        return res.json({
            data: userObject,
            success: true,
            message: "Users data fetched success",
            statusCode: 200,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Internal Server error",
            statusCode: 500,
            err,
        });
    }
}

export async function changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;

    const loggedInUser = req.userId;

    const user = await User.findOne({
        where: { userId: loggedInUser },
    });
    const validPassword = bcrypt.compareSync(oldPassword, user.password);

    if (!validPassword) {
        console.log("Password not correct");
        return res.status(400).send({
            message: "Password not correct",
            statusCode: 400,
            success: false,
        });
    }

    await User.update(
        { password: newPassword },
        {
            where: {
                userId: loggedInUser,
            },
        }
    );

    res.send({
        message: "Password changed successfully",
        statusCode: 200,
        success: true,
    });
}
