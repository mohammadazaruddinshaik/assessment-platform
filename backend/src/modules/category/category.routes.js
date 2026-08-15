const express = require("express");

const categoryController = require("./category.controller");
const validate = require("../../middlewares/validation.middleware");
const asyncHandler = require("../../utils/async-handler");

const {
    createCategorySchema,
    categoryIdSchema,
    updateCategorySchema
} = require("./category.validation");

const router = express.Router();

router.post(
    "/",
    validate(createCategorySchema),
    asyncHandler(categoryController.createCategory)
);

router.get(
    "/",
    asyncHandler(categoryController.listCategories)
);

router.get(
    "/:categoryId",
    validate(categoryIdSchema, "params"),
    asyncHandler(categoryController.getCategoryById)
);

router.patch(
    "/:categoryId",
    validate(categoryIdSchema, "params"),
    validate(updateCategorySchema),
    asyncHandler(categoryController.updateCategory)
);

router.delete(
    "/:categoryId",
    validate(categoryIdSchema, "params"),
    asyncHandler(categoryController.deleteCategory)
);


module.exports = router;