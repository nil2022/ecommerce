import Category from "#models/CategorySchema";
import sendResponse from "#utils/response";

export async function createCategory(req, res) {
    const { name, description } = req.body;

    try {
        const result = await Category.create({ name, description });
        return sendResponse(res, 201, result, "Category created successfully");
    } catch (error) {
        return sendResponse(res, 500, null, "Internal server error");
    }
}

export async function getAllCategory(req, res) {
    try {
        const result = await Category.findAll();
        return sendResponse(res, 200, result, "Categories fetched successfully");
    } catch (error) {
        return sendResponse(res, 500, null, "Internal server error");
    }
}

export async function getCategoryOnId(req, res) {
    const categoryId = req.query.id;

    try {
        const result = await Category.findOne({
            where: {
                id: categoryId,
            },
        });
        if (result == null) {
            return sendResponse(res, 400, null, "Category id does not exist");
        }
        return sendResponse(res, 200, result, "Category fetched successfully");
    } catch (error) {
        return sendResponse(res, 500, null, "Internal server error");
    }
}

export async function updateCategory(req, res) {
    const categoryId = req.query.id;
    try {
        const result = await Category.findOne({
            where: {
                id: categoryId,
            },
        });
        if (result) {
            result.name = req.body.name;
            result.description = req.body.description;

            result.save();

            return sendResponse(res, 200, result, "Category updated successfully");
        } else {
            return sendResponse(res, 400, null, "Category id does not exist");
        }
    } catch (error) {
        return sendResponse(res, 500, null, "Internal server error");
    }
}

export async function deleteCategory(req, res) {
    const categoryId = req.query.id;
    try {
        const result = await Category.destroy({
            where: {
                id: categoryId,
            },
        });
        if (!result) {
            return sendResponse(res, 400, null, "Category id does not exist");
        }
        return sendResponse(res, 200, null, "Category deleted successfully");
    } catch (err) {
        return sendResponse(res, 500, null, "Internal server error");
    }
}
