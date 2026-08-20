const express = require("express");

const questionRoutes =
    require("../modules/question/question.routes");

const questionMediaRoutes =
    require("../modules/question-media/question-media.routes");

const categoryRoutes =
    require("../modules/category/category.routes");

const tagRoutes =
    require("../modules/tag/tag.routes");

const languageRoutes =
    require("../modules/language/language.routes");

const testCaseRoutes =
    require("../modules/test-case/test-case.routes");

const testCaseMediaRoutes =
    require("../modules/test-case-media/test-case-media.routes");


const codingQuestionConfigRoutes =
    require("../modules/coding-question-config/coding-question-config.routes");

const router = express.Router();

router.use("/questions", questionRoutes);

router.use("/questions", questionMediaRoutes);

router.use("/questions", codingQuestionConfigRoutes);

router.use("/categories", categoryRoutes);

router.use("/tags", tagRoutes);

router.use("/languages", languageRoutes);

router.use("/test-cases", testCaseRoutes);

router.use("/test-cases", testCaseMediaRoutes);

module.exports = router;