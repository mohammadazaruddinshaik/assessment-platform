const express = require("express");

const languageController =
    require("./language.controller");

const {
    createLanguageSchema,
    languageIdSchema,
    updateLanguageSchema,
    listLanguagesSchema
} = require("./language.validation");

const validate = require("../../middlewares/validation.middleware");
const asyncHandler = require("../../utils/async-handler");

const router = express.Router();

router.post(
    "/",
    validate(createLanguageSchema, "body"),
    asyncHandler(languageController.createLanguage)
);

router.get(
    "/",
    validate(listLanguagesSchema, "query"),
    asyncHandler(languageController.listLanguages)
);

router.get(
    "/:languageId",
    validate(languageIdSchema, "params"),
    asyncHandler(languageController.getLanguageById)
);

router.patch(
    "/:languageId",
    validate(languageIdSchema, "params"),
    validate(updateLanguageSchema, "body"),
    asyncHandler(languageController.updateLanguage)
);

router.delete(
    "/:languageId",
    validate(languageIdSchema, "params"),
    asyncHandler(languageController.deleteLanguage)
);


module.exports = router;