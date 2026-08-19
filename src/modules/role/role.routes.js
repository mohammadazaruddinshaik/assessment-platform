const express = require('express');
const router = express.Router();

const roleController = require('./role.controller');
const validate = require("../../middlewares/validation.middleware");
const asyncHandler = require("../../utils/async-handler");


router.post(
    "/create",
    validate(roleValidation.createRoleSchema),
    asyncHandler(roleController.createRole)
);


router.get(
    "/:id",
    validate(roleValidation.getRoleByIdSchema),
    asyncHandler(roleController.getRoleById)
);


router.patch(
    "/update/:id",
    validate(roleValidation.updateRoleSchema),
    asyncHandler(roleController.updateRole)
);


router.delete(
    "/delete/:id",
    validate(roleValidation.deleteRoleSchema),
    asyncHandler(roleController.deleteRole)
);