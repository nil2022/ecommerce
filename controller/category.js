const { Categories } = require("../models");

async function createCategory(req, res) {
    const {	name, description } = req.body;

    try {
        const result = await Categories.create({ name, description });
        console.log("result", result);
        res.send({ msg: "Category has been created" });
    } catch (err) {
        console.log("err in creation of categories", err);
        res.status(500).send({ msg: "Internal server error" });
    }
}

async function getAllCategory(req, res) {
    try {
        const result = await Categories.findAll();
        res.send(result);
    } catch (err) {
        console.log("err in getting categories", err);
        res.status(500).send({ msg: "Internal server error" });
    }
}

async function getCategoryOnId(req, res) {
    const categoryId = req.query.id;
	
    try {
        const result = await Categories.findOne({
            where: {
                id: categoryId,
            },
        });
        if (result == null) {
            res.status(400).send({ msg: "category id does not exist" });
            return;
        }
        res.send(result);
    } catch (err) {
        console.log("err in getting categories based on ID", err);
        res.status(500).send({ msg: "Internal server error" });
    }
}

async function updateCategory(req, res) {
    const categoryId = req.query.id;
    try {
        const result = await Categories.findOne({
            where: {
                id: categoryId,
            },
        });
        if (result) {
            result.name = req.body.name;
            result.description = req.body.description;

            result.save();

            res.send({ msg: "category updated", updatedCategory: result });
        } else {
            console.log("category id does not exist");
            res.status(400).send({ msg: "category id does not exist" });
        }
    } catch (err) {
        console.log("err in getting categories", err);
        res.status(500).send({ msg: "Internal server error" });
    }
}

async function deleteCategory(req, res) {
    const categoryId = req.query.id;
    try {
        const result = await Categories.destroy({
            where: {
                id: categoryId,
            },
        });
        if (!result) {
            res.status(400).send({ msg: "category id does not exist" });
            return;
        }
        res.send({ msg: "catrgory deleted"});
    } catch (err) {
        console.log("err in deleting categories", err);
        res.status(500).send({ msg: "Internal server error" });
    }
}

module.exports = {
    createCategory,
    getAllCategory,
    getCategoryOnId,
    updateCategory,
    deleteCategory,
};
