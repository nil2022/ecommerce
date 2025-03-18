import Role from "#models/RoleSchema";

export async function checkRoles(req, res, next) {
    if (req.body.roles) {
        let roles = req.body.roles;
        let flag = true;
        const findRoleFromDB = await Role.findAll({
            attributes: ["id"],
        });

        // Iterates through roles in database and checks if they match given roles.
        if (findRoleFromDB.length > 0) {
            const storeRoles = [];

            for (let i = 0; i < findRoleFromDB.length; i++) {
                storeRoles.push(findRoleFromDB[i].dataValues.id);
            }
            for (let i = 0; i < roles.length; i++) {
                const result = storeRoles.includes(Number(roles[i]), 0);
                // console.log('\nresult:',result, roles[i], storeRoles)

                if (!result) {
                    flag = false;
                    break;
                }
            }

            if (flag) {
                next();
            } else {
                res.status(400).send({ msg: "Role id does not exist" });
                return;
            }
        } else {
            res.status(500).send({
                msg: "Internal server error, Role not found",
            });
            return;
        }
    } else {
        next();
    }
}
