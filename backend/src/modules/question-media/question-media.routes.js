const express = require("express");

const controller =
    require("./question-media.controller");

const validate =
    require("../../middlewares/validation.middleware");

const asyncHandler =
    require("../../utils/async-handler");

const {

    createQuestionMediaSchema,

    updateQuestionMediaSchema,

    questionIdSchema,

    questionMediaParamsSchema

} = require("./question-media.validation");

const {

    uploadSingleImage

} = require("../../middlewares/upload.middleware");


const router = express.Router();


router.post(

    "/:questionId/media",

    uploadSingleImage,

    validate(questionIdSchema, "params"),

    validate(createQuestionMediaSchema),

    asyncHandler(

        controller.createQuestionMedia

    )

);


router.get(

    "/:questionId/media",

    validate(questionIdSchema, "params"),

    asyncHandler(

        controller.getQuestionMedias

    )

);


router.get(

    "/:questionId/media/:mediaId",

    validate(

        questionMediaParamsSchema,

        "params"

    ),

    asyncHandler(

        controller.getQuestionMediaById

    )

);


router.patch(

    "/:questionId/media/:mediaId",

    uploadSingleImage,

    validate(

        questionMediaParamsSchema,

        "params"

    ),

    validate(updateQuestionMediaSchema),

    asyncHandler(

        controller.updateQuestionMedia

    )

);


router.delete(

    "/:questionId/media/:mediaId",

    validate(

        questionMediaParamsSchema,

        "params"

    ),

    asyncHandler(

        controller.deleteQuestionMedia

    )

);


module.exports = router;