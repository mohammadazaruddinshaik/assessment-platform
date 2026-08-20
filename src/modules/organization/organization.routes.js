const express = require("express");
const router = express.Router();

const organizationController = require("./organization.controller");
const validate = require("../../middlewares/validation.middleware");
const {
    createOrganizationSchema,
    getOrganizationByIdSchema,
    updateOrganizationSchema,
    deleteOrganizationSchema
} = require("./organization.validation");

router.post(
    "/create",
     validate(createOrganizationSchema),
    organizationController.createOrganization
);

router.get(
    "/list",
    organizationController.listOrganization
);


router.get(
    "/:id",
    validate(getOrganizationByIdSchema, "params"),
    organizationController.getOrganizationById
);

router.patch(
    "/update/:id",
    validate(getOrganizationByIdSchema, "params"),
    organizationController.updateOrganization
);

router.delete(
    "/delete/:id",
    validate(getOrganizationByIdSchema, "params"),
    organizationController.deleteOrganization
);


module.exports = router;