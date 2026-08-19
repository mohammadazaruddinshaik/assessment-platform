const express = require("express");

const questionRoutes = require("../modules/question/question.routes");
const userRoutes = require("../modules/user/user.routes");
const roleRoutes = require("../modules/role/role.routes");

const router = express.Router();

router.use("/questions", questionRoutes);
router.use("/users", userRoutes);
router.use("/role",roleRoutes);

module.exports = router;