const express = require("express");

const controller =
    require("./coding-question-config.controller");

const validate =
    require("../../middlewares/validation.middleware");

const asyncHandler =
    require("../../utils/async-handler");

const {
    createCodingQuestionConfigSchema,
    updateCodingQuestionConfigSchema,
    questionIdSchema
} = require("./coding-question-config.validation");


const router = express.Router();


router.post(
    "/:questionId/coding-config",

    validate(questionIdSchema, "params"),

    validate(createCodingQuestionConfigSchema),

    asyncHandler(
        controller.createCodingQuestionConfig
    )
);


router.get(
    "/:questionId/coding-config",

    validate(questionIdSchema, "params"),

    asyncHandler(
        controller.getCodingQuestionConfig
    )
);


router.patch(
    "/:questionId/coding-config",

    validate(questionIdSchema, "params"),

    validate(updateCodingQuestionConfigSchema),

    asyncHandler(
        controller.updateCodingQuestionConfig
    )
);


router.delete(
    "/:questionId/coding-config",

    validate(questionIdSchema, "params"),

    asyncHandler(
        controller.deleteCodingQuestionConfig
    )
);


module.exports = router;