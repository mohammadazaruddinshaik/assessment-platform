const express = require("express");
const router = express.Router();

const deparmentController = require("./department.controller");
const validate = require("../../middlewares/validation.middleware");
const asyncHandler = require("../../utils/async-handler");

const {
    createDepartmentSchema,
    getDepartmentByIdSchema,
    updateDepartmentSchema,
    deleteDepartmentSchema
} = require("./department.schema");


router.post(
    "/create",
    validate(createDepartmentSchema),
    departmentController.createDepartment
);

router.get(
    "/:id",
    validate(getDepartmentByIdSchema),
    departmentController.getDepartmentById
);

router.patch(
    "/:id",
    validate(updateDepartmentSchema),
    departmentController.updateDepartment
);

router.delete(
    "/:id",
    validate(deleteDepartmentSchema),
    departmentController.deleteDepartment
);

router.get(
    "/get-all", 
    departmentController.getDepartments
);

module.exports = router;