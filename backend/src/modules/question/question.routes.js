const express = require("express");

const questionController = require("./question.controller");
const validate = require("../../middlewares/validation.middleware");
const asyncHandler = require("../../utils/async-handler");

const {
    createQuestionSchema,
    questionIdSchema,
    listQuestionsSchema,
    updateQuestionSchema,
    addQuestionTagSchema,
    questionTagParamsSchema
} = require("./question.validation");

const router = express.Router();

router.post(
    "/",
    validate(createQuestionSchema),
    asyncHandler(questionController.createQuestion)
);

router.get(
    "/",
    validate(listQuestionsSchema, "query"),
    asyncHandler(questionController.listQuestions)
);

router.post(
    "/:questionId/tags",
    validate(questionIdSchema, "params"),
    validate(addQuestionTagSchema, "body"),
    asyncHandler(questionController.addTagToQuestion)
);

router.get(
    "/:questionId/tags",
    validate(questionIdSchema, "params"),
    asyncHandler(questionController.getQuestionTags)
);


router.delete(
    "/:questionId/tags/:tagId",
    validate(questionTagParamsSchema, "params"),
    asyncHandler(questionController.removeTagFromQuestion)
);


router.get(
    "/:questionId",
    validate(questionIdSchema, "params"),
    asyncHandler(questionController.getQuestionById)
);

router.patch(
    "/:questionId",
    validate(questionIdSchema, "params"),
    validate(updateQuestionSchema),
    asyncHandler(questionController.updateQuestion)
);


router.delete(
    "/:questionId",
    validate(questionIdSchema, "params"),
    asyncHandler(questionController.deleteQuestion)
);


module.exports = router;