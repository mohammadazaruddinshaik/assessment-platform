const express = require("express");

const questionRoutes = require("../modules/question/question.routes");
const categoryRoutes = require("../modules/category/category.routes");
const tagRoutes = require("../modules/tag/tag.routes");
const languageRoutes = require("../modules/language/language.routes");

const router = express.Router();

router.use("/questions", questionRoutes);
router.use("/categories", categoryRoutes);
router.use("/tags", tagRoutes);
router.use("/languages", languageRoutes);



module.exports = router;