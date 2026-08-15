const express = require("express");

const questionRoutes = require("../modules/question/question.routes");

const router = express.Router();

router.use("/questions", questionRoutes);

module.exports = router;