import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import sendResponse from "#utils/response";
import { storeError } from "#utils/helpers";
import { getData, setData } from "#utils/redis";
import { userSignInValidation, userSignUpValidation } from "#utils/validation";
import User from "#models/UserSchema";
import Cart from "#models/CartSchema";

export async function login(req, res) {
    const { userId, email, password, roles } = req.body;

    try {
        const { error } = userSignUpValidation.validate(req.body);
        if (error) {
            return sendResponse(res, 400, false, error.details[0].message);
        }

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ userId: userId }, { email: email }],
            },
        });
        if (existingUser) {
            console.table({
                message: "UserId or Email already exist",
            });
            return sendResponse(
                res,
                400,
                false,
                "UserId or Email already exist"
            );
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
        return sendResponse(
            res,
            201,
            true,
            "User has been created successfully",
            user
        );
    } catch (err) {
        storeError(err);
        return sendResponse(res, 500, false, `${err.name}: ${err.message}`);
    }
}

export async function signIn(req, res) {
    const { userId, password } = req.body;

    // Validate the userData against the schema
    const { error } = userSignInValidation.validate(req.body);

    if (error) {
        return sendResponse(res, 400, null, error.details[0].message);
    }

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
                return sendResponse(res, 400, null, "Password not correct");
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

            const cacheFormatData = {
                id: user.id,
                userId: user.userId,
                email: user.email,
                authorities: authorities,
                accessToken: accessToken,
            };
            await setData("userData", cacheFormatData, {
                EX: 3600, // Expiration in seconds
                XX: true, // Only set if key exists
            });

            console.log(`await getData("userData")`, await getData("userData"));

            res.cookie("accessToken", accessToken, cookieOptions);

            return sendResponse(
                res,
                200,
                finalUser,
                "User logged in successfully",
                accessToken
            );
        } else {
            console.log({ message: "User not found in database" });
            return sendResponse(res, 400, null, "User not found in database");
        }
    } catch (err) {
        console.log(err);
        sendResponse(res, 500, null, `Internal Server Error`);
    }
}

export async function logout(req, res) {
    const cookieOptions = {
        http: true,
        secure: true,
    };
    // sendResponse(res, 200, null, "User logged out successfully");
    res.clearCookie("accessToken", "", cookieOptions);
    // return res.status(200).clearCookie("accessToken", "", cookieOptions).json({
    //     msg: "User logged out successfully",
    //     statusCode: 200,
    //     success: true,
    // });
    return sendResponse(res, 200, null, "User logged out successfully");
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
