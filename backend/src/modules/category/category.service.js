const ApiError = require("../../utils/api-error");
const categoryRepository = require("./category.repository");

const createCategory = async (data) => {
    const existingCategory =
        await categoryRepository.findCategoryByName(data.name);

    if (existingCategory) {
        throw new ApiError(
            409,
            "Category already exists",
            "CATEGORY_ALREADY_EXISTS"
        );
    }

    return categoryRepository.createCategory({
        ...data,
        createdBy: "system",
        updatedBy: "system"
    });
};

const getCategoryById = async (categoryId) => {
    const category =
        await categoryRepository.findCategoryById(categoryId);

    if (!category) {
        throw new ApiError(
            404,
            "Category not found",
            "CATEGORY_NOT_FOUND"
        );
    }

    return category;
};

const listCategories = async () => {
    return categoryRepository.findCategories();
};

const updateCategory = async (categoryId, data) => {
    const existingCategory =
        await categoryRepository.findCategoryById(categoryId);

    if (!existingCategory) {
        throw new ApiError(
            404,
            "Category not found",
            "CATEGORY_NOT_FOUND"
        );
    }

    if (data.name && data.name !== existingCategory.name) {
        const duplicateCategory =
            await categoryRepository.findCategoryByName(data.name);

        if (duplicateCategory) {
            throw new ApiError(
                409,
                "Category already exists",
                "CATEGORY_ALREADY_EXISTS"
            );
        }
    }

    return categoryRepository.updateCategory(
        categoryId,
        {
            ...data,
            updatedBy: "system"
        }
    );
};

const deleteCategory = async (categoryId) => {
    const existingCategory =
        await categoryRepository.findCategoryById(categoryId);

    if (!existingCategory) {
        throw new ApiError(
            404,
            "Category not found",
            "CATEGORY_NOT_FOUND"
        );
    }

    await categoryRepository.deleteCategory(categoryId);
};


module.exports = {
    createCategory,
    getCategoryById,
    listCategories,
    updateCategory,
    deleteCategory
};