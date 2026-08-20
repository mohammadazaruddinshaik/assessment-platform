const express = require("express");

const controller = require("./test-case.controller");
const validate = require("../../middlewares/validation.middleware");

const {
    createTestCaseSchema,
    createBulkTestCasesSchema,
    updateTestCaseSchema,
    testCaseIdParamsSchema,
    questionIdParamsSchema
} = require("./test-case.validation");

const router = express.Router();


router.post(
    "/",
    validate(createTestCaseSchema),
    controller.createTestCase
);


router.post(
    "/question/:questionId/bulk",
    validate(questionIdParamsSchema, "params"),
    validate(createBulkTestCasesSchema),
    controller.createBulkTestCases
);


router.get(
    "/question/:questionId",
    validate(questionIdParamsSchema, "params"),
    controller.getTestCasesByQuestionId
);


router.get(
    "/:id",
    validate(testCaseIdParamsSchema, "params"),
    controller.getTestCaseById
);


router.patch(
    "/:id",
    validate(testCaseIdParamsSchema, "params"),
    validate(updateTestCaseSchema),
    controller.updateTestCase
);


router.delete(
    "/:id",
    validate(testCaseIdParamsSchema, "params"),
    controller.deleteTestCase
);


module.exports = router;