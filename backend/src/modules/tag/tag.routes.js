const express = require("express");

const tagController = require("./tag.controller");
const validate = require("../../middlewares/validation.middleware");
const asyncHandler = require("../../utils/async-handler");

const {
    createTagSchema,
    tagIdSchema,
    updateTagSchema
} = require("./tag.validation");

const router = express.Router();

router.post(
    "/",
    validate(createTagSchema, "body"),
    asyncHandler(tagController.createTag)
);

router.get(
    "/",
    asyncHandler(tagController.listTags)
);

router.get(
    "/:tagId",
    validate(tagIdSchema, "params"),
    asyncHandler(tagController.getTagById)
);

router.patch(
    "/:tagId",
    validate(tagIdSchema, "params"),
    validate(updateTagSchema, "body"),
    asyncHandler(tagController.updateTag)
);

router.delete(
    "/:tagId",
    validate(tagIdSchema, "params"),
    asyncHandler(tagController.deleteTag)
);

module.exports = router;