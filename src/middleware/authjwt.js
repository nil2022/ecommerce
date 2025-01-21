import jwt from "jsonwebtoken";
import { UserModel as User } from "../models/index.js";
import chalk from "chalk";

const log = console.log;
export const verifyToken = (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "") ||
        req.headers["x-access-token"] ||
        req.headers["cookie"]?.replace("accessToken=", "");

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            // console.log(decoded);
            if (decoded) {
                req.user = decoded;
                req.userType = decoded.authorities;
                next();
            } else {
                return res.status(400).send({
                    msg: "Auth token has expired. Please Re-Login",
                });
            }
        } catch (err) {
            log(chalk.redBright.bgRed(err.name + ": " + err.message));
            res.status(400).send({
                msg: "Invalid token. Please Re-Login",
            });
            return;
        }
    } else {
        res.status(401).send({ msg: "Auth token is missing" });
        return;
    }
};

export async function isAdmin(req, res, next) {
    const userId = req.user?.id || null;

    try {
        if (userId) {
            const user = await User.findByPk(userId);
            const userRoles = await user.getRoles();

            for (let i = 0; i < userRoles.length; i++) {
                if (
                    userRoles[i]?.dataValues?.name === "Admin" ||
                    userRoles[i]?.dataValues?.name === "SuperAdmin"
                ) {
                    return next();  // If admin found, proceed to next middleware
                }
            }
            log(
                chalk.whiteBright.bgRed.bold("User does not have admin access")
            );
            return res.status(400).send({ msg: "Access Denied" });
        } else {
            return res.status(400).send({ msg: "Invalid user id" });
        }
    } catch (err) {
        log(chalk.redBright.bgRed(err.name + ": " + err.message));
        log(chalk.grey(err.stack));
        return res.status(500).send({ msg: "Internal Server error" });
    }
}
