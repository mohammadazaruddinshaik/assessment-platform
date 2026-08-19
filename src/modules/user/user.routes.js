const express = require('express');
const router = express.Router();

const userController = require('./user.controller');
const validate = require("../../middlewares/validation.middleware");
const asyncHandler = require("../../utils/async-handler");

const {
    createUserSchema,
    bulkUserSchema,
    updateUserSchema,
    deleteUserSchema
    } = require('./user.validation');

router.post(
    '/create', 
    validate(userValidation.createUserSchema), 
    asyncHandler(userController.createUser)
);


router.post(
    '/create-bulk',
    validate(userValidation.bulkUserSchema),
    asyncHandler(userController.uploadBulkUsers)
);

router.get(
    '/:id', 
    validate(userValidation.findUserByIdSchema),
    asyncHandler(userController.getUserById)
);

router.patch(
    '/update-user/:id',
    validate(userValidation.updateUserSchema),
    asyncHandler(userController.updateUser)
);

router.delete(
    '/delete-user/:id',
    validate(userValidation.deleteUserSchema),
    asyncHandler(userController.deleteUser)
);

module.exports = router;