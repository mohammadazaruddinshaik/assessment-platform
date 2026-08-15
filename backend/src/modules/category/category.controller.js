const categoryService = require("./category.service");
const ApiResponse = require("../../utils/api-response");

const createCategory = async (req, res) => {
    const category = await categoryService.createCategory(
        req.validated.body
    );

    return ApiResponse.created(
        res,
        category,
        "Category created successfully"
    );
};

const getCategoryById = async (req, res) => {
    const category = await categoryService.getCategoryById(
        req.validated.params.categoryId
    );

    return ApiResponse.success(
        res,
        category,
        "Category fetched successfully"
    );
};

const listCategories = async (req, res) => {
    const categories = await categoryService.listCategories();

    return ApiResponse.success(
        res,
        categories,
        "Categories fetched successfully"
    );
};


const updateCategory = async (req, res) => {
    const category = await categoryService.updateCategory(
        req.validated.params.categoryId,
        req.validated.body
    );

    return ApiResponse.success(
        res,
        category,
        "Category updated successfully"
    );
};

const deleteCategory = async (req, res) => {
    await categoryService.deleteCategory(
        req.validated.params.categoryId
    );

    return ApiResponse.success(
        res,
        null,
        "Category deleted successfully"
    );
};


module.exports = {
    createCategory,
    getCategoryById,
    listCategories,
    updateCategory,
    deleteCategory
};