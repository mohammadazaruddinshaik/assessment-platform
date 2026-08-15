const express = require("express");

const questionRoutes = require("../modules/question/question.routes");
const categoryRoutes = require("../modules/category/category.routes");

const router = express.Router();

router.use("/questions", questionRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;