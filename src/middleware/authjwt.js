import jwt from "jsonwebtoken";
import { UserModel as User } from "../models/index.js";
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
                req.userId = decoded.id;
                next();
            } else {
                return res.status(400).send({
                    msg: "Auth token has expired. Please Re-Login",
                });
            }
        } catch (err) {
            console.log(err);
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
    const userId = req.userId;

    try {
        const user = await User.findByPk(userId);
        const userRoles = await user.getRoles();
        for (let i = 0; i < userRoles.length; i++) {
            if (
                userRoles[i].dataValues.name === "Admin" ||
                userRoles[i].dataValues.name === "SuperAdmin"
            ) {
                next();
                return;
            }
        }
        res.status(400).send({ msg: "User does not have admin access" });
        return;
    } catch (err) {
        res.status(500).send({ msg: "Internal Server error", err });
        return;
    }
}
