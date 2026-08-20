const express = require('express');
const router = express.Router();

const roleController = require('./role.controller');
const validate = require("../../middlewares/validation.middleware");
const asyncHandler = require("../../utils/async-handler");

const {
    createRoleSchema,
    getRoleByIdSchema,
    updateRoleSchema,
    deleteRoleSchema
} = require('./role.validation');


router.post(
    "/create",
    validate(createRoleSchema),
    asyncHandler(roleController.createRole)
);


router.get(
    "/:id",
    validate(getRoleByIdSchema),
    asyncHandler(roleController.getRoleById)
);


router.patch(
    "/update/:id",
    validate(updateRoleSchema),
    asyncHandler(roleController.updateRole)
);


router.delete(
    "/delete/:id",
    validate(deleteRoleSchema),
    asyncHandler(roleController.deleteRole)
);

module.exports = router;    