const express = require("express");

const userRoutes = require("../modules/user/user.routes");
const roleRoutes = require("../modules/role/role.routes");
const organizationRoutes = require("../modules/organization/organization.routes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/organization", organizationRoutes);

module.exports = router;