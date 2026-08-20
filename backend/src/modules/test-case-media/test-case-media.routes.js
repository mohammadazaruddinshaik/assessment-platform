const express = require("express");

const controller =
    require("./test-case-media.controller");

const validate =
    require("../../middlewares/validation.middleware");

const asyncHandler =
    require("../../utils/async-handler");

const {
    createTestCaseMediaSchema,
    updateTestCaseMediaSchema,
    testCaseIdSchema,
    testCaseMediaParamsSchema
} = require("./test-case-media.validation");

const {
    uploadSingleImage
} = require("../../middlewares/upload.middleware");


const router = express.Router();


router.post(
    "/:testCaseId/media",
    uploadSingleImage,
    validate(testCaseIdSchema, "params"),
    validate(createTestCaseMediaSchema),
    asyncHandler(
        controller.createTestCaseMedia
    )
);


router.get(
    "/:testCaseId/media",
    validate(testCaseIdSchema, "params"),
    asyncHandler(
        controller.getTestCaseMedias
    )
);


router.get(
    "/:testCaseId/media/:mediaId",
    validate(
        testCaseMediaParamsSchema,
        "params"
    ),
    asyncHandler(
        controller.getTestCaseMediaById
    )
);


router.patch(
    "/:testCaseId/media/:mediaId",
    uploadSingleImage,
    validate(
        testCaseMediaParamsSchema,
        "params"
    ),
    validate(updateTestCaseMediaSchema),
    asyncHandler(
        controller.updateTestCaseMedia
    )
);


router.delete(
    "/:testCaseId/media/:mediaId",
    validate(
        testCaseMediaParamsSchema,
        "params"
    ),
    asyncHandler(
        controller.deleteTestCaseMedia
    )
);


module.exports = router;